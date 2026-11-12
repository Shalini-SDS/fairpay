'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { logoutAction } from '@/app/(frontend)/actions'
import type { AppUser } from '@/lib/app-auth'

const links = [
  { href: '/customer', label: 'Home', icon: '⌂' },
  { href: '/customer/complaints', label: 'My complaints', icon: '◇' },
  { href: '/customer/payments', label: 'My payments', icon: '▣' },
  { href: '/customer/profile', label: 'Profile', icon: '○' },
]

function Brand() {
  return (
    <Link href="/customer" className="flex items-center gap-2.5 font-bold text-[#003087]">
      <span className="grid size-9 place-items-center rounded-[11px] bg-gradient-to-br from-[#0750a4] to-[#00246b] text-white shadow-[0_7px_16px_rgba(0,48,135,.22)]">
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className="text-[18px]">
        FairPay <b className="text-[#009cde]">AI</b>
      </span>
    </Link>
  )
}

export default function CustomerShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: AppUser
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const signOut = async () => {
    await logoutAction()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,rgba(0,156,222,.09),transparent_26rem),#f5f7fa] text-[#172b4d]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-[70px] items-center border-b border-[#e4e7ec] bg-white/95 px-5 backdrop-blur-xl md:px-8">
        <Brand />
        <span className="ml-4 hidden rounded-full bg-[#eaf5fc] px-2.5 py-1 text-[9px] font-bold tracking-[.08em] text-[#003087] sm:inline">
          CUSTOMER
        </span>
        <button
          className="ml-auto grid size-10 place-items-center rounded-lg border border-[#e4e7ec] bg-white text-[#475467] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="relative ml-auto hidden md:block">
          <button
            className="flex items-center gap-3 rounded-full p-1 pr-3 hover:bg-[#f5f7fa]"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#dfeef9] text-[11px] font-bold text-[#003087]">
              {user.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span className="grid text-left">
              <b className="text-[11px]">{user.name}</b>
              <small className="text-[9px] text-[#667085]">Customer account</small>
            </span>
            <span className="text-[#98a2b3]">⌄</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 rounded-xl border border-[#e4e7ec] bg-white p-2 shadow-[0_18px_44px_rgba(16,24,40,.16)]">
              <Link
                className="block rounded-lg px-3 py-2.5 text-[11px] hover:bg-[#f3f8fb]"
                href="/customer/profile"
              >
                Account settings
              </Link>
              <button
                className="w-full rounded-lg px-3 py-2.5 text-left text-[11px] text-[#b42318] hover:bg-[#fef3f2]"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <aside
        className={`fixed bottom-0 left-0 top-[70px] z-20 w-[230px] border-r border-[#e4e7ec] bg-white p-4 transition-transform md:translate-x-0 ${menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <p className="mb-3 px-3 text-[9px] font-bold tracking-[.1em] text-[#98a2b3]">
          YOUR ACCOUNT
        </p>
        <nav className="grid gap-1.5">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/customer' && pathname.startsWith(`${link.href}/`))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-[11px] font-semibold transition-all ${
                  active
                    ? 'translate-x-0.5 bg-[#eaf5fc] text-[#003087] shadow-[inset_3px_0_#009cde,0_5px_14px_rgba(0,48,135,.07)]'
                    : 'text-[#475467] hover:bg-[#f5f7fa]'
                }`}
              >
                <span className="grid size-7 place-items-center rounded-md bg-white/70 text-[16px]">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-[#e3eaf0] bg-gradient-to-br from-white to-[#f1f6fa] p-3 shadow-[0_6px_16px_rgba(16,24,40,.07)]">
          <p className="text-[10px] font-semibold">Need help?</p>
          <p className="mt-1 text-[9px] leading-4 text-[#667085]">
            Contact the merchant handling your case.
          </p>
          <button className="mt-2 text-[9px] font-bold text-[#005ea6]">Get support →</button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="fixed inset-0 z-10 bg-[#101828]/30 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="min-h-screen px-4 pb-12 pt-[94px] md:ml-[230px] md:px-8">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </main>
    </div>
  )
}
