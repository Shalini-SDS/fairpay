import 'server-only'

import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { cookies } from 'next/headers'

export type AppRole = 'merchant' | 'customer'

export type AppUser = {
  id: string
  collection: 'users'
  email: string
  name: string
  businessName?: string | null
  role: AppRole
  status: 'active' | 'suspended'
}

export class AppAuthError extends Error {
  constructor(
    readonly code: 'invalid-credentials' | 'role-mismatch' | 'inactive-account' | 'email-in-use',
  ) {
    super(code)
    this.name = 'AppAuthError'
  }
}

type UserRow = {
  id: string
  email: string
  name: string
  business_name: string | null
  role: AppRole
  status: 'active' | 'suspended'
  password_hash: string
}

const SESSION_COOKIE = 'app-session'
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30
const PASSWORD_HASH_BYTES = 64
const databasePath = resolve(process.env.FAIRPAY_DATABASE_PATH || 'data/fairpay.sqlite')

let database: DatabaseSync | undefined

function getDatabase(): DatabaseSync {
  if (database) return database

  mkdirSync(dirname(databasePath), { recursive: true })
  database = new DatabaseSync(databasePath)
  database.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      name TEXT NOT NULL,
      business_name TEXT,
      role TEXT NOT NULL CHECK (role IN ('merchant', 'customer')),
      status TEXT NOT NULL CHECK (status IN ('active', 'suspended')),
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expiration_idx ON sessions(expires_at);
  `)
  database.exec('PRAGMA foreign_keys = ON;')
  return database
}

function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, PASSWORD_HASH_BYTES)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [saltHex, hashHex] = storedHash.split(':')
  if (!saltHex || !hashHex || !/^[a-f0-9]{32}$/.test(saltHex) || !/^[a-f0-9]{128}$/.test(hashHex)) {
    return false
  }

  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), PASSWORD_HASH_BYTES)
  return timingSafeEqual(actual, expected)
}

function toAppUser(row: UserRow): AppUser {
  return {
    id: row.id,
    collection: 'users',
    email: row.email,
    name: row.name,
    businessName: row.business_name,
    role: row.role,
    status: row.status,
  }
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

async function writeSessionCookie(token: string): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_LIFETIME_SECONDS,
    path: '/',
    priority: 'high',
    sameSite: 'lax',
    secure: isProduction,
  })
}

async function setSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS
  const db = getDatabase()

  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Math.floor(Date.now() / 1000))
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashSessionToken(token),
    userId,
    expiresAt,
  )
  await writeSessionCookie(token)
}

export const appAuth = {
  async currentUser(): Promise<AppUser | null> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null

    const row = getDatabase()
      .prepare(
        `SELECT users.id, users.email, users.name, users.business_name, users.role, users.status,
                users.password_hash
         FROM sessions JOIN users ON users.id = sessions.user_id
         WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
      )
      .get(hashSessionToken(token), Math.floor(Date.now() / 1000)) as UserRow | undefined

    if (!row || row.status !== 'active') return null
    return toAppUser(row)
  },

  async login(email: string, password: string, expectedRole?: AppRole): Promise<AppUser> {
    const row = getDatabase()
      .prepare(
        `SELECT id, email, name, business_name, role, status, password_hash
         FROM users WHERE email = ?`,
      )
      .get(email) as UserRow | undefined

    if (!row || !verifyPassword(password, row.password_hash)) {
      throw new AppAuthError('invalid-credentials')
    }
    if (expectedRole && row.role !== expectedRole) {
      throw new AppAuthError('role-mismatch')
    }
    if (row.status !== 'active') throw new AppAuthError('inactive-account')

    await setSession(row.id)
    return toAppUser(row)
  },

  async signup(input: {
    businessName?: string
    email: string
    name: string
    password: string
    role: AppRole
  }): Promise<AppUser> {
    const id = randomBytes(16).toString('hex')
    const row: UserRow = {
      id,
      email: input.email,
      name: input.name,
      business_name: input.businessName || null,
      role: input.role,
      status: 'active',
      password_hash: hashPassword(input.password),
    }
    const db = getDatabase()
    const insertUser = db.prepare(
      `INSERT INTO users (id, email, name, business_name, role, status, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    const insertSession = db.prepare(
      'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
    )
    const token = randomBytes(32).toString('hex')
    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS

    db.exec('BEGIN IMMEDIATE')
    try {
      insertUser.run(
        row.id,
        row.email,
        row.name,
        row.business_name,
        row.role,
        row.status,
        row.password_hash,
        Math.floor(Date.now() / 1000),
      )
      insertSession.run(hashSessionToken(token), id, expiresAt)
      db.exec('COMMIT')
    } catch (error) {
      db.exec('ROLLBACK')
      if (
        typeof error === 'object' &&
        error !== null &&
        'errcode' in error &&
        error.errcode === 2067
      ) {
        throw new AppAuthError('email-in-use')
      }
      throw error
    }

    await writeSessionCookie(token)
    return toAppUser(row)
  },

  async logout(): Promise<void> {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      getDatabase().prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashSessionToken(token))
    }
    cookieStore.delete(SESSION_COOKIE)
  },
}
