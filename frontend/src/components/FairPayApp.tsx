'use client'

import { useEffect, useMemo, useState } from 'react'
import { loginAction, logoutAction, signupAction } from '@/app/(frontend)/actions'
import type { AppRole, AppUser } from '@/lib/app-auth'

function notify(message: string) {
  window.dispatchEvent(new CustomEvent('fairpay-notify', { detail: message }))
}

function exportDemoData(fileName: string) {
  const content = 'FairPay AI demonstration export\nGenerated from sample sandbox data'
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
  notify('Demo export downloaded')
}

type Page =
  | 'overview'
  | 'transactions'
  | 'resolution'
  | 'refunds'
  | 'customers'
  | 'analytics'
  | 'activity'
  | 'settings'
  | 'portal'

type IconName =
  | 'grid'
  | 'card'
  | 'shield'
  | 'refund'
  | 'users'
  | 'chart'
  | 'history'
  | 'settings'
  | 'help'
  | 'search'
  | 'bell'
  | 'chevron'
  | 'arrow'
  | 'check'
  | 'clock'
  | 'alert'
  | 'close'
  | 'menu'
  | 'spark'
  | 'copy'
  | 'external'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    refund: (
      <>
        <path d="M4 7h11a5 5 0 0 1 0 10H8" />
        <path d="m7 4-3 3 3 3" />
        <path d="M11 13h5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" />
        <path d="M16 5a3 3 0 0 1 0 6M17 14a4 4 0 0 1 4 4v2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    history: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2M4 4v5h5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 14.5a2 2 0 0 0 .4 2.2l.1.1-2.7 2.7-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21H9.5v-.2A2 2 0 0 0 8.3 19a2 2 0 0 0-2.2.4l-.1.1-2.7-2.7.1-.1a2 2 0 0 0 .4-2.2A2 2 0 0 0 2 13.3H2V9.5h.2A2 2 0 0 0 4 8.3a2 2 0 0 0-.4-2.2L3.5 6l2.7-2.7.1.1A2 2 0 0 0 8.5 3 2 2 0 0 0 9.7 1.2V1h3.8v.2A2 2 0 0 0 14.7 3a2 2 0 0 0 2.2-.4l.1-.1L19.7 5l-.1.1a2 2 0 0 0-.4 2.2A2 2 0 0 0 21 8.5h.2v3.8H21a2 2 0 0 0-2 1.2Z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.3 2c-.8.4-1.1.9-1.1 1.7M12 17h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l4 2" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const nav: { id: Page; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'transactions', label: 'Transactions', icon: 'card' },
  { id: 'resolution', label: 'Resolution Center', icon: 'shield' },
  { id: 'refunds', label: 'Refunds', icon: 'refund' },
  { id: 'customers', label: 'Customers', icon: 'users' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'activity', label: 'Activity Log', icon: 'history' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

const transactions = [
  {
    id: 'PAY-82001',
    customer: 'Sarah Miller',
    initials: 'SM',
    date: 'May 24, 2025',
    amount: '$100.00',
    status: 'Completed',
    refund: 'Awaiting approval',
  },
  {
    id: 'PAY-82002',
    customer: 'John Carter',
    initials: 'JC',
    date: 'May 23, 2025',
    amount: '$75.00',
    status: 'Completed',
    refund: 'Not requested',
  },
  {
    id: 'PAY-82003',
    customer: 'Emma Wilson',
    initials: 'EW',
    date: 'May 23, 2025',
    amount: '$150.00',
    status: 'Pending',
    refund: 'Not requested',
  },
  {
    id: 'PAY-82004',
    customer: 'David Brown',
    initials: 'DB',
    date: 'May 22, 2025',
    amount: '$60.00',
    status: 'Refunded',
    refund: 'Completed',
  },
  {
    id: 'PAY-82005',
    customer: 'Olivia Martin',
    initials: 'OM',
    date: 'May 21, 2025',
    amount: '$225.00',
    status: 'Completed',
    refund: 'Not requested',
  },
]

const cases = [
  {
    id: 'FP-1024',
    customer: 'Sarah Miller',
    issue: 'Delivery delayed',
    status: 'Needs review',
    priority: 'High',
    date: 'Today, 9:42 AM',
  },
  {
    id: 'FP-1025',
    customer: 'John Carter',
    issue: 'Duplicate payment',
    status: 'Awaiting approval',
    priority: 'Medium',
    date: 'Yesterday',
  },
  {
    id: 'FP-1026',
    customer: 'Emma Wilson',
    issue: 'Refund request',
    status: 'Under review',
    priority: 'Medium',
    date: 'May 22',
  },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <span className="logo-mark">
        <Icon name="shield" size={23} />
      </span>
      {!compact && (
        <span>
          FairPay <b>AI</b>
        </span>
      )}
    </div>
  )
}

function Badge({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'gray'
}) {
  return (
    <span className={`badge ${tone}`}>
      <span className="badge-dot" />
      {children}
    </span>
  )
}

function Button({
  children,
  kind = 'primary',
  icon,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger'
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      className={`button ${kind}`}
      onClick={onClick ?? (() => notify('Action completed in this demo'))}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  )
}

function Avatar({ initials = 'AM', size = 'md' }: { initials?: string; size?: 'sm' | 'md' }) {
  return <span className={`avatar ${size}`}>{initials}</span>
}

function Sidebar({
  page,
  setPage,
  open,
  setOpen,
  userName,
}: {
  page: Page
  setPage: (p: Page) => void
  open: boolean
  setOpen: (v: boolean) => void
  userName: string
}) {
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="side-head">
        <Logo />
        <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <Icon name="close" />
        </button>
      </div>
      <div className="demo-label">MERCHANT WORKSPACE</div>
      <nav>
        {nav.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? 'active' : ''}
            onClick={() => {
              setPage(item.id)
              setOpen(false)
            }}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.id === 'resolution' && <em>4</em>}
          </button>
        ))}
      </nav>
      <div className="side-bottom">
        <button className="profile">
          <Avatar initials={initials} />
          <span className="profile-copy">
            <strong>{userName}</strong>
            <small>Administrator</small>
          </span>
        </button>
      </div>
    </aside>
  )
}

function Topbar({
  page,
  setPage,
  setMenu,
  onLogout,
  userName,
}: {
  page: Page
  setPage: (page: Page) => void
  setMenu: (v: boolean) => void
  onLogout: () => void
  userName: string
}) {
  const title = nav.find((n) => n.id === page)?.label || 'Overview'
  const [search, setSearch] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const runSearch = () => {
    const term = search.toLowerCase()
    if (term.includes('refund')) setPage('refunds')
    else if (term.includes('customer') || term.includes('sarah')) setPage('customers')
    else if (term.includes('case') || term.includes('fp-')) setPage('resolution')
    else setPage('transactions')
    notify(`Showing results for “${search || 'all records'}”`)
  }
  return (
    <header className="topbar">
      <button className="menu-button" onClick={() => setMenu(true)} aria-label="Open menu">
        <Icon name="menu" />
      </button>
      <div className="breadcrumb">
        <span>FairPay</span>
        <Icon name="chevron" size={13} />
        <strong>{title}</strong>
      </div>
      <div className="top-actions">
        <label className="global-search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search cases, transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && runSearch()}
          />
        </label>
        <span className="connection">
          <span />
          PayPal Sandbox Connected
        </span>
        <button
          className="icon-button"
          aria-label="Notifications"
          onClick={() => {
            setNotificationsOpen(!notificationsOpen)
            setProfileOpen(false)
          }}
        >
          <Icon name="bell" />
          <i />
        </button>
        <button
          className="top-profile"
          onClick={() => {
            setProfileOpen(!profileOpen)
            setNotificationsOpen(false)
          }}
        >
          <Avatar
            initials={userName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          />
          <span>{userName}</span>
          <Icon name="chevron" size={14} />
        </button>
        {notificationsOpen && (
          <div className="top-popover notification-popover">
            <div>
              <strong>Notifications</strong>
              <button onClick={() => notify('All notifications marked as read')}>
                Mark all read
              </button>
            </div>
            <button onClick={() => setPage('resolution')}>
              <span className="activity-icon">
                <Icon name="alert" size={15} />
              </span>
              <span>
                <b>FP-1024 needs review</b>
                <small>8 minutes ago</small>
              </span>
            </button>
            <button onClick={() => setPage('refunds')}>
              <span className="activity-icon">
                <Icon name="refund" size={15} />
              </span>
              <span>
                <b>Refund awaiting approval</b>
                <small>42 minutes ago</small>
              </span>
            </button>
          </div>
        )}
        {profileOpen && (
          <div className="top-popover profile-popover">
            <button onClick={() => setPage('settings')}>Account settings</button>
            <button onClick={onLogout}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  )
}

function PageHeading({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: React.ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  )
}

function Metric({
  title,
  value,
  meta,
  icon,
  tone = 'blue',
}: {
  title: string
  value: string
  meta: React.ReactNode
  icon: IconName
  tone?: string
}) {
  return (
    <div className="metric card">
      <div className={`metric-icon ${tone}`}>
        <Icon name={icon} />
      </div>
      <div className="metric-copy">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
    </div>
  )
}

function Select({
  children,
  options,
  onChange,
}: {
  children: React.ReactNode
  options?: string[]
  onChange?: (value: string) => void
}) {
  const current = String(children)
  const inferredOptions = current.toLowerCase().includes('day')
    ? ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days']
    : current.toLowerCase().includes('status')
      ? ['All statuses', 'Completed', 'Pending', 'Refunded', 'Failed']
      : current.toLowerCase().includes('amount')
        ? ['Amount range', 'Under $100', '$100–$250', 'Over $250']
        : [current]
  const values = Array.from(new Set([current, ...(options ?? inferredOptions)]))
  return (
    <select
      className="select"
      value={onChange ? current : undefined}
      defaultValue={onChange ? undefined : current}
      onChange={(event) => {
        onChange?.(event.target.value)
        if (!onChange) notify(`Filter changed to ${event.target.value}`)
      }}
    >
      {values.map((value) => (
        <option key={value}>{value}</option>
      ))}
    </select>
  )
}

function LineChart({ analytics = false }: { analytics?: boolean }) {
  return (
    <div className={`chart-wrap ${analytics ? 'large' : ''}`}>
      <div className="y-labels">
        <span>$8k</span>
        <span>$6k</span>
        <span>$4k</span>
        <span>$2k</span>
        <span>$0</span>
      </div>
      <svg
        viewBox="0 0 700 220"
        preserveAspectRatio="none"
        role="img"
        aria-label="Payment activity over time"
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#009cde" stopOpacity=".2" />
            <stop offset="100%" stopColor="#009cde" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="grid-lines">
          <path d="M0 10H700M0 60H700M0 110H700M0 160H700M0 210H700" />
        </g>
        <path
          className="area"
          d="M0 170 C50 160 65 95 120 115 S200 55 260 85 S340 40 400 70 S480 30 540 52 S620 30 700 18 V220 H0Z"
        />
        <path
          className="line successful"
          d="M0 170 C50 160 65 95 120 115 S200 55 260 85 S340 40 400 70 S480 30 540 52 S620 30 700 18"
        />
        <path
          className="line refunded"
          d="M0 195 C70 190 85 175 130 185 S220 158 275 175 S360 145 420 165 S520 132 570 158 S640 135 700 145"
        />
      </svg>
      <div className="x-labels">
        <span>May 18</span>
        <span>May 19</span>
        <span>May 20</span>
        <span>May 21</span>
        <span>May 22</span>
        <span>May 23</span>
        <span>May 24</span>
      </div>
    </div>
  )
}

function Donut() {
  return (
    <div className="resolution-donut">
      <div className="donut">
        <div>
          <strong>43</strong>
          <span>Total cases</span>
        </div>
      </div>
      <div className="legend">
        <p>
          <i className="resolved" />
          <span>Resolved</span>
          <strong>28</strong>
        </p>
        <p>
          <i className="review" />
          <span>Under review</span>
          <strong>8</strong>
        </p>
        <p>
          <i className="waiting" />
          <span>Awaiting approval</span>
          <strong>5</strong>
        </p>
        <p>
          <i className="escalated" />
          <span>Escalated</span>
          <strong>2</strong>
        </p>
      </div>
    </div>
  )
}

function Overview({ navigate }: { navigate: (p: Page) => void }) {
  const [showNotice, setShowNotice] = useState(true)
  return (
    <>
      <PageHeading
        title="Good morning, Alex!"
        subtitle="Here's an overview of your payment activity and customer resolutions."
      >
        <Select>Last 7 days</Select>
        <Button onClick={() => navigate('resolution')}>View unresolved cases</Button>
      </PageHeading>
      {showNotice && (
        <div className="notice">
          <Icon name="alert" size={17} />
          <span>
            <strong>Demo workspace:</strong> All transactions and PayPal operations shown here are
            sample sandbox data.
          </span>
          <button onClick={() => setShowNotice(false)}>Dismiss</button>
        </div>
      )}
      <div className="metrics-grid">
        <Metric
          title="Total payments"
          value="$24,850"
          icon="card"
          meta={
            <>
              <b className="up">↑ 12.5%</b> vs previous period
            </>
          }
        />
        <Metric
          title="Refunds processed"
          value="$2,450"
          icon="refund"
          tone="cyan"
          meta="18 refunds this period"
        />
        <Metric
          title="Open complaints"
          value="12"
          icon="alert"
          tone="amber"
          meta={
            <>
              <b className="warn">4 require attention</b>
            </>
          }
        />
        <Metric
          title="Cases resolved"
          value="86%"
          icon="check"
          tone="green"
          meta={
            <>
              <b className="up">↑ 4.2%</b> vs previous period
            </>
          }
        />
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <h2>Payment activity</h2>
              <p>Gross payments and refunds over time</p>
            </div>
            <Select>Last 7 days</Select>
          </div>
          <div className="chart-legend">
            <span>
              <i className="success-line" />
              Successful payments
            </span>
            <span>
              <i className="refund-line" />
              Refunded payments
            </span>
          </div>
          <LineChart />
        </section>
        <section className="card resolution-card">
          <div className="card-head">
            <div>
              <h2>Resolution overview</h2>
              <p>Current case distribution</p>
            </div>
            <button className="link" onClick={() => navigate('analytics')}>
              View details
            </button>
          </div>
          <Donut />
        </section>
      </div>
      <div className="bottom-grid">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Priority cases</h2>
              <p>Cases that need your attention</p>
            </div>
            <button className="link" onClick={() => navigate('resolution')}>
              View all cases <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>CASE</th>
                  <th>CUSTOMER</th>
                  <th>ISSUE</th>
                  <th>RISK</th>
                  <th>STATUS</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cases.map((c, i) => (
                  <tr key={c.id}>
                    <td>
                      <b className="blue-text">{c.id}</b>
                    </td>
                    <td>{c.customer}</td>
                    <td>{c.issue}</td>
                    <td>
                      <span className={`risk-dot r${i}`} />
                      {i === 0 ? 'High' : 'Medium'}
                    </td>
                    <td>
                      <Badge tone={i === 1 ? 'amber' : 'blue'}>{c.status}</Badge>
                    </td>
                    <td>
                      <button className="link" onClick={() => navigate('resolution')}>
                        View case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card activity-card">
          <div className="card-head">
            <div>
              <h2>Recent activity</h2>
              <p>Latest workspace updates</p>
            </div>
          </div>
          <div className="activity-list">
            {[
              ['spark', 'AI analyzed complaint FP-1024', '8 minutes ago'],
              ['check', 'You approved refund FP-1023', '42 minutes ago'],
              ['refund', 'Sandbox refund successfully processed', '1 hour ago'],
              ['alert', 'New complaint received from Sarah Miller', '2 hours ago'],
            ].map(([icon, text, time]) => (
              <div key={text}>
                <span className="activity-icon">
                  <Icon name={icon as IconName} size={16} />
                </span>
                <p>
                  <strong>{text}</strong>
                  <small>{time}</small>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function SummaryStrip({ items }: { items: [string, string, string][] }) {
  return (
    <div className="summary-strip card">
      {items.map(([label, value, tone]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small className={tone}>{tone === 'positive' ? '↑ 8.4% this period' : tone}</small>
        </div>
      ))}
    </div>
  )
}

function Filters({
  search = 'Search by ID or customer name',
  query = '',
  status = 'All statuses',
  onQuery,
  onStatus,
}: {
  search?: string
  query?: string
  status?: string
  onQuery?: (value: string) => void
  onStatus?: (value: string) => void
}) {
  return (
    <div className="filters card">
      <label className="filter-search">
        <Icon name="search" size={17} />
        <input
          placeholder={search}
          value={query}
          onChange={(event) => onQuery?.(event.target.value)}
        />
      </label>
      <Select>Date: Last 30 days</Select>
      <Select
        options={[
          'All statuses',
          'Completed',
          'Pending',
          'Refunded',
          'Processing',
          'Awaiting approval',
          'Failed',
        ]}
        onChange={onStatus}
      >
        {status}
      </Select>
      <Select>Amount range</Select>
      <button
        className="link"
        onClick={() => {
          onQuery?.('')
          onStatus?.('All statuses')
          notify('Filters reset')
        }}
      >
        Reset filters
      </button>
    </div>
  )
}

function Transactions({ openDrawer }: { openDrawer: () => void }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const visibleTransactions = transactions.filter((transaction) => {
    const matchesQuery = `${transaction.id} ${transaction.customer}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesStatus = status === 'All statuses' || transaction.status === status
    return matchesQuery && matchesStatus
  })
  return (
    <>
      <PageHeading
        title="Transactions"
        subtitle="View payments, check transaction details and track refund activity."
      >
        <Button
          kind="secondary"
          icon="external"
          onClick={() => exportDemoData('fairpay-transactions.csv')}
        >
          Export
        </Button>
      </PageHeading>
      <SummaryStrip
        items={[
          ['Total transactions', '1,248', 'positive'],
          ['Successful payments', '1,194', '95.7%'],
          ['Pending payments', '18', 'Needs review'],
          ['Refunded transactions', '36', '2.9%'],
        ]}
      />
      <Filters query={query} status={status} onQuery={setQuery} onStatus={setStatus} />
      <section className="card data-card">
        <div className="card-head">
          <div>
            <h2>All transactions</h2>
            <p>{visibleTransactions.length} matching sample transactions</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>PAYMENT STATUS</th>
                <th>REFUND STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((t) => (
                <tr key={t.id} onClick={openDrawer} className="clickable">
                  <td>
                    <b className="blue-text">{t.id}</b>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <Avatar initials={t.initials} size="sm" />
                      <span>
                        {t.customer}
                        <small>{t.customer.toLowerCase().replace(' ', '.')}@email.com</small>
                      </span>
                    </div>
                  </td>
                  <td>{t.date}</td>
                  <td>
                    <b>{t.amount}</b>
                  </td>
                  <td>
                    <span className="paypal-p">P</span> PayPal
                  </td>
                  <td>
                    <Badge
                      tone={
                        t.status === 'Completed'
                          ? 'green'
                          : t.status === 'Pending'
                            ? 'amber'
                            : 'gray'
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      tone={
                        t.refund === 'Completed'
                          ? 'green'
                          : t.refund === 'Awaiting approval'
                            ? 'amber'
                            : 'gray'
                      }
                    >
                      {t.refund}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className="row-action"
                      onClick={(event) => {
                        event.stopPropagation()
                        openDrawer()
                      }}
                    >
                      <Icon name="chevron" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>
            Page {page} · Showing {visibleTransactions.length} sample records
          </span>
          <div>
            <Button kind="secondary" disabled={page === 1} onClick={() => setPage(1)}>
              Previous
            </Button>
            <Button
              kind="secondary"
              onClick={() => {
                setPage(2)
                notify('Showing the next page of demo records')
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function TransactionDrawer({
  close,
  navigate,
}: {
  close: () => void
  navigate: (p: Page) => void
}) {
  return (
    <>
      <div className="overlay" onClick={close} />
      <aside className="drawer">
        <div className="drawer-head">
          <div>
            <span>TRANSACTION DETAILS</span>
            <h2>PAY-82001</h2>
          </div>
          <button className="icon-button" onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-status">
          <Badge tone="green">Completed</Badge>
          <span>Paid May 24, 2025 at 9:14 AM</span>
        </div>
        <div className="amount-panel">
          <span>Payment amount</span>
          <strong>$100.00</strong>
          <small>USD · PayPal balance</small>
        </div>
        <section>
          <h3>Payment information</h3>
          <dl className="detail-list">
            <dt>PayPal Transaction ID</dt>
            <dd>PAY-82001</dd>
            <dt>
              Capture ID{' '}
              <button className="info-tip" title="Identifies the captured payment in PayPal">
                ?
              </button>
            </dt>
            <dd>3GG21872JL880103N</dd>
            <dt>Refunded amount</dt>
            <dd>$0.00</dd>
            <dt>Remaining refundable</dt>
            <dd>
              <b>$100.00</b>
            </dd>
          </dl>
        </section>
        <section>
          <h3>Customer</h3>
          <div className="person">
            <Avatar initials="SM" />
            <div>
              <strong>Sarah Miller</strong>
              <span>sarah.miller@email.com</span>
            </div>
          </div>
        </section>
        <section>
          <h3>Order & delivery</h3>
          <dl className="detail-list">
            <dt>Order ID</dt>
            <dd>ORD-4418</dd>
            <dt>Item</dt>
            <dd>Wireless headphones</dd>
            <dt>Expected delivery</dt>
            <dd>May 21, 2025</dd>
            <dt>Delivery status</dt>
            <dd>
              <Badge tone="amber">Not confirmed</Badge>
            </dd>
          </dl>
        </section>
        <section className="related">
          <h3>Related complaint</h3>
          <button
            onClick={() => {
              close()
              navigate('resolution')
            }}
          >
            <span>
              <b>FP-1024</b>
              <small>Delivery delayed · High priority</small>
            </span>
            <Icon name="chevron" />
          </button>
        </section>
        <div className="drawer-actions">
          <Button
            onClick={() => {
              close()
              navigate('resolution')
            }}
          >
            Open Resolution Center
          </Button>
          <Button
            kind="secondary"
            onClick={() => {
              close()
              navigate('refunds')
            }}
          >
            View refund history
          </Button>
        </div>
      </aside>
    </>
  )
}

function Resolution({ approve }: { approve: () => void }) {
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('All')
  const visibleCases = cases.filter((item) => {
    const matchesQuery = `${item.id} ${item.customer} ${item.issue}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesTab =
      tab === 'All' ||
      (tab === 'High priority' && item.priority === 'High') ||
      (tab === 'Awaiting' && item.status.includes('Awaiting'))
    return matchesQuery && matchesTab
  })
  return (
    <>
      <PageHeading
        title="Resolution Center"
        subtitle="Understand customer issues, review AI recommendations and resolve payment complaints."
      >
        <Button kind="secondary" onClick={() => notify('Case guidelines opened')}>
          Case guidelines
        </Button>
      </PageHeading>
      <div className="resolution-layout">
        <aside className="case-inbox card">
          <div className="inbox-head">
            <div>
              <h2>Complaint inbox</h2>
              <Badge tone="blue">12 open</Badge>
            </div>
            <label className="filter-search">
              <Icon name="search" size={16} />
              <input
                placeholder="Search cases"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <div className="case-tabs">
            {['All', 'High priority', 'Awaiting'].map((item) => (
              <button
                key={item}
                className={tab === item ? 'active' : ''}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="case-list">
            {visibleCases.map((c) => {
              const i = cases.findIndex((item) => item.id === c.id)
              return (
                <button
                  key={c.id}
                  className={selected === i ? 'active' : ''}
                  onClick={() => setSelected(i)}
                >
                  <div>
                    <b>{c.id}</b>
                    <Badge tone={c.priority === 'High' ? 'red' : 'amber'}>{c.priority}</Badge>
                  </div>
                  <strong>{c.customer}</strong>
                  <p>
                    {c.issue}:{' '}
                    {i === 0
                      ? "Order hasn't arrived after expected date"
                      : i === 1
                        ? 'Customer sees the charge twice'
                        : 'Customer requested a partial refund'}
                  </p>
                  <span>
                    <Badge tone="blue">{c.status}</Badge>
                    <small>{c.date}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>
        <section className="case-detail">
          <div className="case-title card">
            <div>
              <span>CASE FP-1024</span>
              <h2>Delivery delayed</h2>
              <p>Received today at 9:42 AM</p>
            </div>
            <div>
              <Badge tone="red">High priority</Badge>
              <Badge tone="blue">Needs review</Badge>
            </div>
          </div>
          <div className="card complaint-card">
            <div className="section-title">
              <span className="number">1</span>
              <div>
                <h2>Customer complaint</h2>
                <p>What Sarah told us</p>
              </div>
            </div>
            <blockquote>
              “I ordered wireless headphones a week ago, but they haven't arrived. I contacted
              support twice and still haven't received an update. I would like a refund.”
            </blockquote>
            <div className="complaint-meta">
              <div>
                <span>Customer</span>
                <b>Sarah Miller</b>
              </div>
              <div>
                <span>Transaction</span>
                <b className="blue-text">PAY-82001</b>
              </div>
              <div>
                <span>Order</span>
                <b>ORD-4418</b>
              </div>
              <div>
                <span>Amount</span>
                <b>$100.00</b>
              </div>
              <div>
                <span>Category</span>
                <b>Delivery delay</b>
              </div>
              <div>
                <span>Sentiment</span>
                <b>Frustrated</b>
              </div>
            </div>
          </div>
          <div className="ai-panel">
            <div className="section-title">
              <span className="ai-icon">
                <Icon name="spark" />
              </span>
              <div>
                <h2>AI complaint analysis</h2>
                <p>Plain-language summary based on available case information</p>
              </div>
              <Badge tone="blue">AI-generated</Badge>
            </div>
            <p className="ai-summary">
              The customer paid for an order but has not received it by the expected delivery date.
              They contacted the merchant twice without a response and are requesting a refund.
            </p>
            <div className="analysis-grid">
              <div>
                <span>Issue identified</span>
                <b>Delayed delivery</b>
              </div>
              <div>
                <span>Refund requested</span>
                <b>Yes — full refund</b>
              </div>
              <div>
                <span>Communication</span>
                <b>2 unanswered messages</b>
              </div>
              <div>
                <span>Suggested priority</span>
                <b className="red-text">High</b>
              </div>
            </div>
            <small className="ai-note">
              <Icon name="alert" size={15} />
              AI analysis may be incomplete. Review the evidence before taking action.
            </small>
          </div>
          <div className="card risk-panel">
            <div className="section-title">
              <span className="number">2</span>
              <div>
                <h2>Dispute risk indicators</h2>
                <p>Why this case needs attention</p>
              </div>
            </div>
            <div className="risk-score">
              <div className="score-ring">
                <strong>85</strong>
                <span>/ 100</span>
              </div>
              <div>
                <h3>High risk indicator</h3>
                <p>This is an illustrative rule-based score, not a probability of a chargeback.</p>
              </div>
            </div>
            <div className="risk-factors">
              {[
                ['Delivery overdue', 95, 'Expected 3 days ago'],
                ['No delivery evidence', 90, 'Tracking not supplied'],
                ['Unanswered messages', 80, '2 customer messages'],
                ['Refund requested', 75, 'Full refund requested'],
              ].map(([label, score, detail]) => (
                <div key={label as string}>
                  <span>
                    <b>{label}</b>
                    <small>{detail}</small>
                  </span>
                  <div className="progress">
                    <i style={{ width: `${score}%` }} />
                  </div>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="card evidence-panel">
            <div className="section-title">
              <span className="number">3</span>
              <div>
                <h2>Evidence & order timeline</h2>
                <p>Payment, delivery and customer communication</p>
              </div>
              <Button kind="secondary" onClick={() => notify('Evidence uploader opened')}>
                Add evidence
              </Button>
            </div>
            <div className="timeline">
              <div className="done">
                <i>
                  <Icon name="check" size={14} />
                </i>
                <span>
                  <b>Payment completed</b>
                  <small>May 14 · $100.00 paid via PayPal</small>
                </span>
              </div>
              <div className="done">
                <i>
                  <Icon name="card" size={14} />
                </i>
                <span>
                  <b>Order confirmed</b>
                  <small>May 14 · Wireless headphones, order ORD-4418</small>
                </span>
              </div>
              <div className="warning">
                <i>
                  <Icon name="alert" size={14} />
                </i>
                <span>
                  <b>Expected delivery date passed</b>
                  <small>May 21 · No delivery confirmation was supplied</small>
                </span>
              </div>
              <div>
                <i>
                  <Icon name="history" size={14} />
                </i>
                <span>
                  <b>Customer contacted support twice</b>
                  <small>May 22–23 · No merchant response recorded</small>
                </span>
              </div>
              <div>
                <i>
                  <Icon name="alert" size={14} />
                </i>
                <span>
                  <b>Complaint received</b>
                  <small>Today, 9:42 AM · Full refund requested</small>
                </span>
              </div>
            </div>
          </div>
          <div className="recommendation-panel">
            <div className="section-title">
              <span className="ai-icon">
                <Icon name="spark" />
              </span>
              <div>
                <h2>Recommended resolution</h2>
                <p>AI recommendation — merchant approval required</p>
              </div>
            </div>
            <p>
              Consider issuing a full refund because the expected delivery date has passed, delivery
              has not been confirmed, and the customer made multiple unanswered attempts to contact
              support.
            </p>
            <div className="recommendation-details">
              <div>
                <span>Recommended action</span>
                <b>Full refund</b>
              </div>
              <div>
                <span>Recommended amount</span>
                <b>$100.00 USD</b>
              </div>
              <div>
                <span>Primary reason</span>
                <b>Delivery not confirmed</b>
              </div>
            </div>
            <div className="merchant-note">
              <Icon name="shield" />
              <span>
                <b>You stay in control</b>
                <small>
                  FairPay AI will never approve or submit a refund without your confirmation.
                </small>
              </span>
            </div>
            <div className="recommendation-actions">
              <Button onClick={approve}>Approve refund</Button>
              <Button kind="secondary" onClick={() => notify('Recommendation is now editable')}>
                Edit recommendation
              </Button>
              <Button kind="ghost" onClick={() => notify('Recommendation rejected for this demo')}>
                Reject
              </Button>
              <Button kind="ghost" onClick={() => notify('Case escalated to a manager')}>
                Escalate case
              </Button>
            </div>
          </div>
          <div className="card response-panel">
            <div className="card-head">
              <div>
                <h2>Suggested customer response</h2>
                <p>Review and edit before sending</p>
              </div>
              <Badge tone="blue">AI-generated</Badge>
            </div>
            <p>
              Hello Sarah, we're sorry your order has not arrived as expected. We have reviewed your
              concern and are processing your refund request. We will update you once the payment
              provider confirms the result.
            </p>
            <div>
              <Button
                kind="secondary"
                icon="copy"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    "Hello Sarah, we're sorry your order has not arrived as expected.",
                  )
                  notify('Suggested response copied')
                }}
              >
                Copy response
              </Button>
              <Button kind="ghost" onClick={() => notify('Customer response is now editable')}>
                Edit response
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function RefundModal({ close, confirm }: { close: () => void; confirm: () => void }) {
  return (
    <>
      <div className="overlay modal-overlay" />
      <div className="modal">
        <div className="modal-icon">
          <Icon name="refund" />
        </div>
        <h2>Confirm refund</h2>
        <p>Review the details before submitting this sandbox refund.</p>
        <div className="confirm-details">
          <div>
            <span>Customer</span>
            <b>Sarah Miller</b>
          </div>
          <div>
            <span>Original payment</span>
            <b>$100.00</b>
          </div>
          <div>
            <span>Previous refunds</span>
            <b>$0.00</b>
          </div>
          <div>
            <span>Refund amount</span>
            <b className="large">$100.00</b>
          </div>
          <div>
            <span>Remaining refundable balance</span>
            <b>$100.00</b>
          </div>
          <div>
            <span>Reason</span>
            <b>Delivery not confirmed</b>
          </div>
        </div>
        <div className="warning-box">
          <Icon name="alert" />
          <p>
            <b>Please verify the refund amount.</b>
            <span>
              This action will submit a simulated refund request to PayPal Sandbox. No real funds
              will move.
            </span>
          </p>
        </div>
        <div className="modal-actions">
          <Button kind="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={confirm}>Confirm sandbox refund</Button>
        </div>
      </div>
    </>
  )
}

function SuccessModal({ close, navigate }: { close: () => void; navigate: (p: Page) => void }) {
  return (
    <>
      <div className="overlay modal-overlay" />
      <div className="modal result-modal">
        <div className="success-check">
          <Icon name="check" size={30} />
        </div>
        <Badge tone="blue">SIMULATED SANDBOX RESULT</Badge>
        <h2>Refund submitted</h2>
        <p>The sample refund request was accepted for processing.</p>
        <div className="result-amount">
          <span>Refund amount</span>
          <strong>$100.00 USD</strong>
        </div>
        <div className="confirm-details">
          <div>
            <span>Refund reference</span>
            <b>RFD-SBX-10482</b>
          </div>
          <div>
            <span>Date</span>
            <b>May 24, 2025</b>
          </div>
          <div>
            <span>Status</span>
            <Badge tone="blue">Processing</Badge>
          </div>
          <div>
            <span>Case</span>
            <b>FP-1024</b>
          </div>
        </div>
        <small className="sandbox-note">
          This is a prototype result, not a real PayPal API response.
        </small>
        <div className="modal-actions">
          <Button kind="secondary" onClick={close}>
            Close
          </Button>
          <Button
            onClick={() => {
              close()
              navigate('refunds')
            }}
          >
            View refund management
          </Button>
        </div>
      </div>
    </>
  )
}

function Refunds({ approve }: { approve: () => void }) {
  const rows = [
    ['RFD-10482', 'Sarah Miller', 'PAY-82001', '$100.00', '$100.00', 'Awaiting approval'],
    ['RFD-10481', 'David Brown', 'PAY-82004', '$60.00', '$60.00', 'Completed'],
    ['RFD-10480', 'Liam Davis', 'PAY-81998', '$120.00', '$40.00', 'Processing'],
    ['RFD-10479', 'Sophia Clark', 'PAY-81974', '$85.00', '$85.00', 'Failed'],
  ]
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const visibleRows = rows.filter((row) => {
    const matchesQuery = `${row[0]} ${row[1]} ${row[2]}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'All statuses' || row[5] === status
    return matchesQuery && matchesStatus
  })
  return (
    <>
      <PageHeading
        title="Refund Management"
        subtitle="Review refund requests and track refunds processed through PayPal."
      >
        <Select>Last 30 days</Select>
      </PageHeading>
      <div className="metrics-grid">
        <Metric
          title="Total refund amount"
          value="$2,450"
          icon="refund"
          meta="18 refunds this period"
        />
        <Metric
          title="Refunds completed"
          value="14"
          icon="check"
          tone="green"
          meta="$1,935 successfully refunded"
        />
        <Metric
          title="Awaiting approval"
          value="3"
          icon="clock"
          tone="amber"
          meta="Merchant action needed"
        />
        <Metric
          title="Failed refunds"
          value="1"
          icon="alert"
          tone="red"
          meta="Review and try again"
        />
      </div>
      <Filters
        search="Search refund, case or customer"
        query={query}
        status={status}
        onQuery={setQuery}
        onStatus={setStatus}
      />
      <section className="card data-card">
        <div className="card-head">
          <div>
            <h2>Refund requests</h2>
            <p>{visibleRows.length} matching refund requests</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>REFUND ID</th>
                <th>CUSTOMER</th>
                <th>TRANSACTION</th>
                <th>ORIGINAL AMOUNT</th>
                <th>REFUND AMOUNT</th>
                <th>REQUESTED</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => {
                const i = rows.findIndex((row) => row[0] === r[0])
                return (
                  <tr key={r[0]}>
                    <td>
                      <b className="blue-text">{r[0]}</b>
                    </td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                    <td>
                      <b>{r[4]}</b>
                    </td>
                    <td>{i === 0 ? 'Today, 10:02 AM' : `May ${23 - i}, 2025`}</td>
                    <td>
                      <Badge
                        tone={
                          r[5] === 'Completed'
                            ? 'green'
                            : r[5] === 'Failed'
                              ? 'red'
                              : r[5] === 'Processing'
                                ? 'blue'
                                : 'amber'
                        }
                      >
                        {r[5]}
                      </Badge>
                    </td>
                    <td>
                      {i === 0 ? (
                        <Button kind="secondary" onClick={approve}>
                          Review
                        </Button>
                      ) : (
                        <button
                          className="row-action"
                          onClick={() => notify(`Opened refund ${r[0]}`)}
                        >
                          <Icon name="chevron" size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Customers() {
  const data = [
    ['Sarah Miller', 'sarah.miller@email.com', '8', '$842.00', '1', '1'],
    ['John Carter', 'john.carter@email.com', '5', '$410.00', '0', '1'],
    ['Emma Wilson', 'emma.wilson@email.com', '12', '$1,275.00', '2', '1'],
    ['David Brown', 'david.brown@email.com', '3', '$245.00', '1', '0'],
  ]
  const [profile, setProfile] = useState(false)
  const [query, setQuery] = useState('')
  const visibleCustomers = data.filter((customer) =>
    `${customer[0]} ${customer[1]}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeading
        title="Customers"
        subtitle="View customer payment history and related resolution cases."
      />
      <Filters search="Search customer name or email" query={query} onQuery={setQuery} />
      <section className="card data-card">
        <div className="card-head">
          <div>
            <h2>Customer directory</h2>
            <p>{visibleCustomers.length} matching sample customers</p>
          </div>
          <Button
            kind="secondary"
            icon="external"
            onClick={() => exportDemoData('fairpay-customers.csv')}
          >
            Export
          </Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>TOTAL PAYMENTS</th>
                <th>TOTAL SPENT</th>
                <th>REFUNDS</th>
                <th>OPEN CASES</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((r) => (
                <tr key={r[0]} className="clickable" onClick={() => setProfile(true)}>
                  <td>
                    <div className="customer-cell">
                      <Avatar
                        initials={r[0]
                          .split(' ')
                          .map((x) => x[0])
                          .join('')}
                        size="sm"
                      />
                      <span>
                        <b>{r[0]}</b>
                        <small>{r[1]}</small>
                      </span>
                    </div>
                  </td>
                  <td>{r[2]}</td>
                  <td>
                    <b>{r[3]}</b>
                  </td>
                  <td>{r[4]}</td>
                  <td>
                    {r[5] === '0' ? (
                      <Badge tone="gray">None</Badge>
                    ) : (
                      <Badge tone="amber">{r[5]} open</Badge>
                    )}
                  </td>
                  <td>
                    <button
                      className="link"
                      onClick={(event) => {
                        event.stopPropagation()
                        setProfile(true)
                      }}
                    >
                      View profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {profile && (
        <>
          <div className="overlay" onClick={() => setProfile(false)} />
          <aside className="drawer customer-drawer">
            <div className="drawer-head">
              <div>
                <span>CUSTOMER PROFILE</span>
                <h2>Sarah Miller</h2>
              </div>
              <button className="icon-button" onClick={() => setProfile(false)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="profile-hero">
              <Avatar initials="SM" />
              <div>
                <h3>Sarah Miller</h3>
                <p>sarah.miller@email.com</p>
                <Badge tone="green">Active customer</Badge>
              </div>
            </div>
            <div className="mini-stats">
              <div>
                <span>Total spent</span>
                <b>$842.00</b>
              </div>
              <div>
                <span>Payments</span>
                <b>8</b>
              </div>
              <div>
                <span>Refunds</span>
                <b>1</b>
              </div>
            </div>
            <section>
              <h3>Current case</h3>
              <div className="profile-case">
                <b>FP-1024 · Delivery delayed</b>
                <span>
                  <Badge tone="red">High priority</Badge>
                </span>
                <p>Wireless headphones have not arrived by the expected date.</p>
              </div>
            </section>
            <section>
              <h3>Recent payments</h3>
              <div className="simple-row">
                <span>
                  <b>PAY-82001</b>
                  <small>May 24 · Wireless headphones</small>
                </span>
                <b>$100.00</b>
              </div>
              <div className="simple-row">
                <span>
                  <b>PAY-81452</b>
                  <small>Apr 12 · Phone case</small>
                </span>
                <b>$42.00</b>
              </div>
            </section>
            <section>
              <h3>Support interactions</h3>
              <div className="timeline compact">
                <div>
                  <i />
                  <span>
                    <b>Complaint submitted</b>
                    <small>Today, 9:42 AM</small>
                  </span>
                </div>
                <div>
                  <i />
                  <span>
                    <b>Message sent to support</b>
                    <small>Yesterday, 3:18 PM</small>
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </>
      )}
    </>
  )
}

function Analytics() {
  const [range, setRange] = useState('Last 30 days')
  return (
    <>
      <PageHeading
        title="Analytics & Insights"
        subtitle="Understand payment performance and customer resolution trends."
      >
        <Select onChange={setRange}>{range}</Select>
        <Button
          kind="secondary"
          onClick={() => setRange(range === 'Last 30 days' ? 'Last 7 days' : 'Last 30 days')}
        >
          Change range
        </Button>
      </PageHeading>
      <div className="insight-banner">
        <span className="ai-icon">
          <Icon name="spark" />
        </span>
        <div>
          <b>AI-generated observations</b>
          <p>
            Based on available sample data for {range.toLowerCase()}. Review these observations
            alongside your business records.
          </p>
        </div>
      </div>
      <div className="analytics-grid">
        <section className="card wide">
          <div className="card-head">
            <div>
              <h2>Payment & refund trends</h2>
              <p>Daily volume · {range}</p>
            </div>
            <div className="chart-legend">
              <span>
                <i className="success-line" />
                Payments
              </span>
              <span>
                <i className="refund-line" />
                Refunds
              </span>
            </div>
          </div>
          <LineChart analytics />
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Complaint categories</h2>
              <p>43 total complaints</p>
            </div>
          </div>
          <div className="bar-list">
            {[
              ['Delivery delay', 42],
              ['Refund request', 26],
              ['Duplicate charge', 18],
              ['Incorrect amount', 9],
              ['Other', 5],
            ].map(([l, v]) => (
              <div key={l as string}>
                <span>
                  <b>{l}</b>
                  <small>{v}%</small>
                </span>
                <i>
                  <em style={{ width: `${v}%` }} />
                </i>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Resolution status</h2>
              <p>Current distribution</p>
            </div>
          </div>
          <Donut />
        </section>
        <section className="card stat-chart">
          <div className="card-head">
            <div>
              <h2>Average resolution time</h2>
              <p>Time from complaint to resolution</p>
            </div>
          </div>
          <strong>
            18.4 <small>hours</small>
          </strong>
          <span className="positive">↓ 12% faster than last period</span>
          <div className="tiny-bars">
            {[45, 62, 48, 76, 58, 83, 68].map((v, i) => (
              <i key={i} style={{ height: `${v}%` }} />
            ))}
          </div>
        </section>
        <section className="card ai-insights">
          <div className="card-head">
            <div>
              <h2>Key observations</h2>
              <p>Generated from sample activity</p>
            </div>
            <Badge tone="blue">AI-generated</Badge>
          </div>
          <div>
            <Icon name="arrow" />
            <p>
              <b>Delivery complaints increased</b>
              <span>Delivery-related complaints rose 14% during this period.</span>
            </p>
          </div>
          <div>
            <Icon name="alert" />
            <p>
              <b>Responses may need attention</b>
              <span>4 unresolved cases have unanswered customer messages.</span>
            </p>
          </div>
          <div>
            <Icon name="refund" />
            <p>
              <b>Delayed deliveries drive refunds</b>
              <span>Most approved refunds were related to delivery delays.</span>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

function ActivityLog() {
  const rows = [
    [
      'Today, 10:04:18 AM',
      'Refund request submitted',
      'FP-1024',
      'PAY-82001',
      'Alex Morgan',
      'Completed',
    ],
    [
      'Today, 10:03:42 AM',
      'Merchant approved refund',
      'FP-1024',
      'PAY-82001',
      'Alex Morgan',
      'Completed',
    ],
    [
      'Today, 9:44:12 AM',
      'Risk indicator calculated',
      'FP-1024',
      'PAY-82001',
      'FairPay AI',
      'Completed',
    ],
    [
      'Today, 9:43:55 AM',
      'AI analysis completed',
      'FP-1024',
      'PAY-82001',
      'FairPay AI',
      'Completed',
    ],
    [
      'Today, 9:42:08 AM',
      'Complaint submitted',
      'FP-1024',
      'PAY-82001',
      'Sarah Miller',
      'Completed',
    ],
    ['Yesterday, 4:18:22 PM', 'Payment received', '—', 'PAY-82003', 'PayPal Sandbox', 'Completed'],
  ]
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const visibleRows = rows.filter((row) => {
    const matchesQuery = row.join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'All statuses' || row[5] === status
    return matchesQuery && matchesStatus
  })
  return (
    <>
      <PageHeading
        title="Activity & Audit Log"
        subtitle="Track important actions and changes across payment resolutions."
      >
        <Button
          kind="secondary"
          icon="external"
          onClick={() => exportDemoData('fairpay-activity-log.csv')}
        >
          Export log
        </Button>
      </PageHeading>
      <div className="notice neutral">
        <Icon name="shield" size={18} />
        <span>
          <strong>Transparent by design:</strong> Important case and refund actions are recorded
          here for accountability.
        </span>
      </div>
      <Filters
        search="Search case or transaction ID"
        query={query}
        status={status}
        onQuery={setQuery}
        onStatus={setStatus}
      />
      <section className="card data-card">
        <div className="card-head">
          <div>
            <h2>Workspace activity</h2>
            <p>{visibleRows.length} matching audit events</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>EVENT</th>
                <th>CASE ID</th>
                <th>TRANSACTION ID</th>
                <th>PERFORMED BY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => {
                const i = rows.findIndex((row) => row[0] === r[0])
                return (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>
                      <div className="event-cell">
                        <span>
                          <Icon
                            name={i < 2 ? 'refund' : i < 4 ? 'spark' : i === 4 ? 'alert' : 'card'}
                            size={16}
                          />
                        </span>
                        <b>{r[1]}</b>
                      </div>
                    </td>
                    <td>
                      <b className="blue-text">{r[2]}</b>
                    </td>
                    <td>{r[3]}</td>
                    <td>{r[4]}</td>
                    <td>
                      <Badge tone="green">{r[5]}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Toggle({ on = true }: { on?: boolean }) {
  const [enabled, setEnabled] = useState(on)
  return (
    <button
      className={`toggle ${enabled ? 'on' : ''}`}
      onClick={() => setEnabled(!enabled)}
      aria-label={enabled ? 'Disable' : 'Enable'}
    >
      <i />
    </button>
  )
}

function Settings() {
  const [tab, setTab] = useState('PayPal Integration')
  const tabs = [
    'PayPal Integration',
    'AI Configuration',
    'Risk Rules',
    'Refund Policy',
    'Notifications',
    'User Management',
  ]
  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Manage integrations, automation preferences and workspace access."
      />
      <div className="settings-layout">
        <aside className="settings-nav">
          {tabs.map((t) => (
            <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>
              {t}
            </button>
          ))}
        </aside>
        <section className="settings-content card">
          {tab === 'PayPal Integration' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>PayPal integration</h2>
                  <p>Manage your sandbox connection and synchronization status.</p>
                </div>
                <Badge tone="green">Sandbox connected</Badge>
              </div>
              <div className="integration-card">
                <span className="paypal-logo">P</span>
                <div>
                  <h3>PayPal Sandbox</h3>
                  <p>Demonstration merchant connection</p>
                </div>
                <Badge tone="blue">SANDBOX</Badge>
              </div>
              <div className="settings-fields">
                <div>
                  <span>Merchant account</span>
                  <b>demo-merchant@fairpay.example</b>
                </div>
                <div>
                  <span>API connection</span>
                  <Badge tone="green">Connected</Badge>
                </div>
                <div>
                  <span>
                    Automatic status updates{' '}
                    <button
                      className="info-tip"
                      title="Payment updates sent automatically by PayPal"
                    >
                      ?
                    </button>
                  </span>
                  <Badge tone="green">Configured</Badge>
                </div>
                <div>
                  <span>Last successful sync</span>
                  <b>Today at 10:04 AM</b>
                </div>
              </div>
              <div className="safe-note">
                <Icon name="shield" />
                <p>
                  <b>Your credentials stay protected</b>
                  <span>Secret keys are never displayed in FairPay AI.</span>
                </p>
              </div>
              <div className="settings-actions">
                <Button onClick={() => notify('Sandbox connection test succeeded')}>
                  Test connection
                </Button>
                <Button kind="secondary" onClick={() => notify('Integration details expanded')}>
                  View integration details
                </Button>
                <Button kind="ghost" onClick={() => notify('Disconnect cancelled in demo mode')}>
                  Disconnect
                </Button>
              </div>
            </>
          )}
          {tab === 'AI Configuration' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>AI configuration</h2>
                  <p>Choose how AI supports your complaint workflow.</p>
                </div>
              </div>
              {[
                ['AI analysis', 'Summarize complaints and identify key facts'],
                ['Complaint classification', 'Organize complaints into clear categories'],
                ['Sentiment analysis', 'Identify the tone of customer messages'],
                ['Resolution recommendations', 'Suggest an action for merchant review'],
              ].map(([a, b]) => (
                <div className="toggle-row" key={a}>
                  <span>
                    <b>{a}</b>
                    <small>{b}</small>
                  </span>
                  <Toggle />
                </div>
              ))}
              <div className="safe-note">
                <Icon name="shield" />
                <p>
                  <b>Merchant review is always required</b>
                  <span>AI recommendations cannot approve or submit refunds.</span>
                </p>
              </div>
            </>
          )}
          {tab === 'Risk Rules' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>Illustrative risk rules</h2>
                  <p>Adjust how strongly each indicator contributes to the case score.</p>
                </div>
                <Button kind="secondary" onClick={() => notify('Default risk weights restored')}>
                  Restore defaults
                </Button>
              </div>
              {[
                ['Delayed delivery', 85],
                ['Missing delivery confirmation', 90],
                ['Unanswered messages', 70],
                ['Repeated complaints', 55],
                ['Refund requested', 65],
              ].map(([l, v]) => (
                <div className="slider-row" key={l as string}>
                  <span>{l}</span>
                  <input type="range" defaultValue={v} />
                  <b>{v}</b>
                </div>
              ))}
              <div className="warning-box">
                <Icon name="alert" />
                <p>
                  <b>These scores are not probabilities.</b>
                  <span>
                    They are transparent, rule-based indicators that help prioritize review.
                  </span>
                </p>
              </div>
              <Button onClick={() => notify('Risk rules saved')}>Save risk rules</Button>
            </>
          )}
          {tab === 'Refund Policy' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>Refund policy</h2>
                  <p>Define which refund requests need additional review.</p>
                </div>
              </div>
              {[
                [
                  'Allow full-refund recommendations',
                  'AI may recommend a full refund when evidence supports it',
                ],
                [
                  'Allow partial-refund recommendations',
                  'AI may suggest an amount below the original payment',
                ],
                ['Require merchant approval', 'Every refund must be approved by a merchant user'],
              ].map(([a, b]) => (
                <div className="toggle-row" key={a}>
                  <span>
                    <b>{a}</b>
                    <small>{b}</small>
                  </span>
                  <Toggle />
                </div>
              ))}
              <label className="field-label">
                Maximum refund without finance review
                <div className="money-input">
                  <span>$</span>
                  <input defaultValue="250.00" />
                </div>
              </label>
              <Button onClick={() => notify('Refund policy saved')}>Save policy</Button>
            </>
          )}
          {tab === 'Notifications' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>Notifications</h2>
                  <p>Choose which updates you receive.</p>
                </div>
              </div>
              {[
                'New complaint received',
                'High-priority case',
                'Refund awaiting approval',
                'Refund completed',
                'Refund failed',
              ].map((a) => (
                <div className="toggle-row" key={a}>
                  <span>
                    <b>{a}</b>
                    <small>Email and in-app notification</small>
                  </span>
                  <Toggle />
                </div>
              ))}
            </>
          )}
          {tab === 'User Management' && (
            <>
              <div className="settings-title">
                <div>
                  <h2>User management</h2>
                  <p>Manage people who can access this workspace.</p>
                </div>
                <Button onClick={() => notify('Team invitation form opened')}>Invite user</Button>
              </div>
              {[
                ['Alex Morgan', 'alex@fairpay.example', 'Admin'],
                ['Jamie Chen', 'jamie@fairpay.example', 'Support Agent'],
                ['Priya Shah', 'priya@fairpay.example', 'Finance Manager'],
              ].map((u, i) => (
                <div className="user-row" key={u[0]}>
                  <Avatar
                    initials={u[0]
                      .split(' ')
                      .map((x) => x[0])
                      .join('')}
                  />
                  <span>
                    <b>{u[0]}</b>
                    <small>{u[1]}</small>
                  </span>
                  <Badge tone={i === 0 ? 'blue' : 'gray'}>{u[2]}</Badge>
                  <Badge tone="green">Active</Badge>
                  <button
                    className="row-action"
                    onClick={() => notify(`User actions opened for ${u[0]}`)}
                  >
                    •••
                  </button>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </>
  )
}

function CustomerPortal({ exit }: { exit: () => void }) {
  const [step, setStep] = useState<'landing' | 'form' | 'success' | 'track'>('landing')
  const [category, setCategory] = useState('My order hasn’t arrived')
  return (
    <div className="portal">
      <header className="portal-head">
        <Logo />
        <div>
          <button onClick={() => setStep('track')}>Track a complaint</button>
          <button onClick={exit}>Merchant dashboard</button>
        </div>
      </header>
      {step === 'landing' && (
        <main className="portal-main">
          <Badge tone="blue">CUSTOMER SUPPORT</Badge>
          <h1>
            How can we help you
            <br />
            with your payment?
          </h1>
          <p>
            Tell us about your order or payment issue. We'll help you find the right resolution.
          </p>
          <div className="issue-options">
            {[
              ['card', 'My order hasn’t arrived', 'Let us know about a late or missing delivery.'],
              [
                'alert',
                'I was charged incorrectly',
                'Report a duplicate or incorrect payment amount.',
              ],
              [
                'refund',
                'I want to request a refund',
                'Ask the merchant to review a refund request.',
              ],
            ].map(([i, t, d]) => (
              <button
                key={t}
                onClick={() => {
                  setCategory(t)
                  setStep('form')
                }}
              >
                <span>
                  <Icon name={i as IconName} size={25} />
                </span>
                <b>{t}</b>
                <p>{d}</p>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
          <small className="portal-safe">
            <Icon name="shield" size={16} />
            Your payment information is handled securely.
          </small>
        </main>
      )}
      {step === 'form' && (
        <main className="portal-form">
          <button className="back-link" onClick={() => setStep('landing')}>
            ← Back to issue selection
          </button>
          <div className="form-card card">
            <div className="form-heading">
              <span>
                <Icon name="card" />
              </span>
              <div>
                <h1>Tell us what happened</h1>
                <p>Provide the details below so the merchant can review your concern.</p>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Full name
                <input defaultValue="Sarah Miller" />
              </label>
              <label>
                Email address
                <input defaultValue="sarah.miller@email.com" />
              </label>
              <label>
                PayPal transaction ID{' '}
                <button className="info-tip" title="Find this in your PayPal payment receipt">
                  ?
                </button>
                <input defaultValue="PAY-82001" />
              </label>
              <label>
                Order ID
                <input defaultValue="ORD-4418" />
              </label>
              <label className="full">
                Issue category
                <select defaultValue={category}>
                  <option>My order hasn’t arrived</option>
                  <option>I was charged incorrectly</option>
                  <option>I want to request a refund</option>
                </select>
              </label>
              <label className="full">
                Describe the problem
                <textarea defaultValue="I ordered wireless headphones a week ago, but they haven't arrived. I contacted support twice and still haven't received an update. I would like a refund." />
                <small>Include dates or other details that may help the merchant.</small>
              </label>
              <label className="full">
                Attachment{' '}
                <button
                  className="upload"
                  type="button"
                  onClick={() => notify('Attachment picker opened')}
                >
                  <span>＋</span>
                  <b>Upload a receipt or delivery screenshot</b>
                  <small>PNG, JPG or PDF · up to 10 MB</small>
                </button>
              </label>
            </div>
            <div className="form-submit">
              <small>
                <Icon name="shield" size={15} />
                Your information will only be shared with the merchant handling your case.
              </small>
              <Button onClick={() => setStep('success')}>Submit complaint</Button>
            </div>
          </div>
        </main>
      )}
      {step === 'success' && (
        <main className="portal-result">
          <div className="success-check">
            <Icon name="check" size={32} />
          </div>
          <h1>Your complaint has been received</h1>
          <p>
            The merchant will review your payment issue. Keep your case reference handy to check for
            updates.
          </p>
          <div className="case-reference">
            <span>Your case reference</span>
            <strong>FP-1024</strong>
            <button
              onClick={() => {
                navigator.clipboard?.writeText('FP-1024')
                notify('Case reference copied')
              }}
            >
              <Icon name="copy" size={16} />
              Copy
            </button>
          </div>
          <div className="what-next">
            <h3>What happens next?</h3>
            <div>
              <span>1</span>
              <p>
                <b>The merchant reviews your issue</b>
                <small>They will check the payment and order information.</small>
              </p>
            </div>
            <div>
              <span>2</span>
              <p>
                <b>You'll receive an update</b>
                <small>We will email you when the case status changes.</small>
              </p>
            </div>
          </div>
          <Button onClick={() => setStep('track')}>Track my complaint</Button>
        </main>
      )}
      {step === 'track' && (
        <main className="portal-track">
          <div className="track-search">
            <Badge tone="blue">CASE TRACKING</Badge>
            <h1>Track your complaint</h1>
            <p>Enter the case reference from your confirmation email.</p>
            <div>
              <input defaultValue="FP-1024" />
              <Button>View status</Button>
            </div>
          </div>
          <div className="track-card card">
            <div className="track-title">
              <div>
                <span>CASE FP-1024</span>
                <h2>Delivery issue</h2>
              </div>
              <Badge tone="blue">Merchant reviewing</Badge>
            </div>
            <p>Submitted today at 9:42 AM · Transaction ending in 2001</p>
            <div className="status-timeline">
              <div className="complete">
                <i>
                  <Icon name="check" />
                </i>
                <span>
                  <b>Complaint received</b>
                  <small>We've sent your concern to the merchant.</small>
                </span>
              </div>
              <div className="current">
                <i>
                  <Icon name="history" />
                </i>
                <span>
                  <b>Merchant reviewing</b>
                  <small>The merchant is reviewing your payment and order details.</small>
                </span>
              </div>
              <div>
                <i>3</i>
                <span>
                  <b>Resolution proposed</b>
                  <small>You'll be notified when an action is proposed.</small>
                </span>
              </div>
              <div>
                <i>4</i>
                <span>
                  <b>Refund submitted</b>
                  <small>If approved, the refund will be sent for processing.</small>
                </span>
              </div>
              <div>
                <i>5</i>
                <span>
                  <b>Refund completed</b>
                  <small>The payment provider confirms the refund.</small>
                </span>
              </div>
            </div>
            <div className="help-box">
              <Icon name="help" />
              <p>
                <b>Need to add more information?</b>
                <span>Reply to your confirmation email and include your case reference.</span>
              </p>
            </div>
          </div>
        </main>
      )}
      <footer className="portal-footer">
        <span>© 2025 FairPay AI · Demonstration portal</span>
        <span>Privacy · Help & Support</span>
      </footer>
    </div>
  )
}

type AuthScreen = 'landing' | 'login' | 'signup'

function PublicLogo() {
  return (
    <button className="public-logo" aria-label="FairPay AI home">
      <Logo />
    </button>
  )
}

function PublicHeader({
  screen,
  setScreen,
}: {
  screen: AuthScreen
  setScreen: (screen: AuthScreen) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="public-header">
      <PublicLogo />
      <button className="public-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav className={open ? 'open' : ''}>
        <button onClick={() => setScreen('landing')}>Product</button>
        <button onClick={() => setScreen('landing')}>How it works</button>
        <button onClick={() => setScreen('landing')}>Security</button>
        <button onClick={() => setScreen('landing')}>Pricing</button>
      </nav>
      <div className="public-actions">
        <Button kind="ghost" onClick={() => setScreen('login')}>
          Log in
        </Button>
        <Button onClick={() => setScreen('signup')}>Start free</Button>
      </div>
      {screen !== 'landing' && (
        <button className="auth-back" onClick={() => setScreen('landing')}>
          <Icon name="chevron" size={15} /> Back to home
        </button>
      )}
    </header>
  )
}

function ProductPreview() {
  return (
    <div className="product-preview">
      <div className="preview-glow" />
      <div className="preview-window">
        <div className="preview-top">
          <span className="preview-brand">
            <span className="logo-mark">
              <Icon name="shield" size={17} />
            </span>
            FairPay AI
          </span>
          <span className="preview-search">
            <Icon name="search" size={13} /> Search payments
          </span>
          <Avatar />
        </div>
        <div className="preview-body">
          <div className="preview-side">
            {['grid', 'card', 'shield', 'refund', 'chart', 'settings'].map((icon, index) => (
              <span key={icon} className={index === 0 ? 'active' : ''}>
                <Icon name={icon as IconName} size={16} />
              </span>
            ))}
          </div>
          <div className="preview-content">
            <div className="preview-title">
              <div>
                <small>Good morning, Alex</small>
                <strong>Payment overview</strong>
              </div>
              <span>Last 7 days⌄</span>
            </div>
            <div className="preview-metrics">
              <div>
                <span>Total payments</span>
                <b>$24,850</b>
                <small>↑ 12.5%</small>
              </div>
              <div>
                <span>Open complaints</span>
                <b>12</b>
                <small>4 need attention</small>
              </div>
              <div>
                <span>Cases resolved</span>
                <b>86%</b>
                <small>↑ 4.2%</small>
              </div>
            </div>
            <div className="preview-lower">
              <div className="preview-chart">
                <span>Payment activity</span>
                <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                  <path d="M0 100 C40 92 50 53 88 67 S145 32 184 51 S244 20 282 39 S347 16 400 9 V120 H0Z" />
                  <path d="M0 100 C40 92 50 53 88 67 S145 32 184 51 S244 20 282 39 S347 16 400 9" />
                </svg>
              </div>
              <div className="preview-case">
                <span>Priority case</span>
                <div className="preview-person">
                  <Avatar initials="SM" size="sm" />
                  <p>
                    <b>Sarah Miller</b>
                    <small>Delivery delayed</small>
                  </p>
                </div>
                <div className="preview-risk">
                  <span>Risk indicator</span>
                  <b>
                    85 <small>/ 100</small>
                  </b>
                </div>
                <button>Review recommendation</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-proof proof-one">
        <span>
          <Icon name="spark" size={17} />
        </span>
        <p>
          <b>AI analysis complete</b>
          <small>Clear evidence and next steps</small>
        </p>
      </div>
      <div className="floating-proof proof-two">
        <span>
          <Icon name="check" size={17} />
        </span>
        <p>
          <b>Refund approved</b>
          <small>Merchant confirmed · $100.00</small>
        </p>
      </div>
    </div>
  )
}

function LandingPage({
  setScreen,
  setLoginRole,
  openPortal,
}: {
  setScreen: (screen: AuthScreen) => void
  setLoginRole: (role: AppRole) => void
  openPortal: () => void
}) {
  return (
    <div className="public-site">
      <PublicHeader screen="landing" setScreen={setScreen} />
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>
                <Icon name="spark" size={14} />
              </span>
              AI-powered payment resolution
            </div>
            <h1>
              Every payment deserves a <em>fair resolution.</em>
            </h1>
            <p>
              Understand customer complaints, review clear AI recommendations, and manage
              merchant-approved refunds through one trusted PayPal-connected workflow.
            </p>
            <div className="hero-actions">
              <Button onClick={() => setScreen('signup')}>
                Start your free workspace <Icon name="arrow" size={16} />
              </Button>
              <Button kind="secondary" onClick={() => setScreen('login')}>
                View merchant demo
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <Icon name="check" size={14} /> No credit card required
              </span>
              <span>
                <Icon name="check" size={14} /> Sandbox-ready
              </span>
              <span>
                <Icon name="shield" size={14} /> Merchant stays in control
              </span>
            </div>
          </div>
          <ProductPreview />
        </section>

        <section className="trusted-strip">
          <p>Built for modern online businesses managing payments with</p>
          <div>
            <span className="paypal-word">
              <b>P</b> PayPal
            </span>
            <span>ECOMMERCE</span>
            <span>MARKETPLACES</span>
            <span>SUBSCRIPTIONS</span>
            <span>DIGITAL GOODS</span>
          </div>
        </section>

        <section className="landing-section solution-section">
          <div className="section-eyebrow">A CLEARER WAY TO RESOLVE</div>
          <h2>From customer concern to fair outcome</h2>
          <p className="section-lead">
            FairPay AI brings the complaint, payment, evidence, and recommended next step together
            so your team can decide with confidence.
          </p>
          <div className="feature-grid">
            {[
              {
                icon: 'card',
                number: '01',
                title: 'See the complete payment story',
                text: 'Connect transactions, order details, delivery evidence, and customer messages in one understandable view.',
              },
              {
                icon: 'spark',
                number: '02',
                title: 'Understand what needs attention',
                text: 'AI summarizes the issue and explains each risk indicator in plain language—never as a black box.',
              },
              {
                icon: 'shield',
                number: '03',
                title: 'You approve every resolution',
                text: 'Review, edit, reject, or approve recommendations. FairPay AI never moves money without merchant confirmation.',
              },
            ].map((feature) => (
              <article key={feature.title}>
                <div>
                  <span>
                    <Icon name={feature.icon as IconName} size={23} />
                  </span>
                  <small>{feature.number}</small>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <button onClick={() => setScreen('signup')}>
                  Learn more <Icon name="arrow" size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="control-section">
          <div className="control-visual">
            <div className="recommendation-demo">
              <div className="demo-panel-head">
                <span>
                  <Icon name="spark" />
                </span>
                <div>
                  <b>Recommended resolution</b>
                  <small>AI recommendation · Your approval required</small>
                </div>
              </div>
              <p>
                Consider a full refund because delivery is overdue, no delivery evidence is
                available, and the customer has contacted support twice.
              </p>
              <div className="demo-resolution">
                <span>
                  Recommended amount <b>$100.00</b>
                </span>
                <span>
                  Risk indicator <b className="high">85 / 100</b>
                </span>
              </div>
              <div className="demo-buttons">
                <button>Approve refund</button>
                <button>Edit</button>
                <button>Reject</button>
              </div>
            </div>
          </div>
          <div className="control-copy">
            <div className="section-eyebrow">HUMAN DECISIONS, AI CLARITY</div>
            <h2>
              AI recommends.
              <br />
              You decide.
            </h2>
            <p>
              FairPay AI turns complicated complaint details into a clear recommendation with
              visible supporting reasons. Your team always makes the final call.
            </p>
            <ul>
              <li>
                <Icon name="check" /> Transparent, rule-based risk indicators
              </li>
              <li>
                <Icon name="check" /> Evidence linked to every recommendation
              </li>
              <li>
                <Icon name="check" /> Merchant confirmation before every refund
              </li>
            </ul>
            <Button kind="secondary" onClick={() => setScreen('signup')}>
              Explore the resolution center
            </Button>
          </div>
        </section>

        <section className="landing-cta">
          <span className="logo-mark">
            <Icon name="shield" />
          </span>
          <h2>Resolve payment concerns with confidence.</h2>
          <p>Start with sample sandbox data and see how simple fair payment resolution can be.</p>
          <div>
            <Button onClick={() => setScreen('signup')}>Create your free workspace</Button>
            <Button kind="secondary" onClick={openPortal}>
              Visit customer portal
            </Button>
            <Button
              kind="ghost"
              onClick={() => {
                setLoginRole('customer')
                setScreen('login')
              }}
            >
              Customer sign in
            </Button>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <Logo />
        <p>Every payment deserves a fair resolution.</p>
        <div>
          <button>Privacy</button>
          <button>Terms</button>
          <button>Security</button>
          <span>© 2025 FairPay AI</span>
        </div>
      </footer>
    </div>
  )
}

function AuthAside({ signup }: { signup: boolean }) {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-glow" />
      <div className="auth-aside-content">
        <span className="auth-kicker">{signup ? 'START RESOLVING FAIRLY' : 'WELCOME BACK'}</span>
        <h2>
          {signup ? 'A clearer payment workflow starts here.' : 'Make every resolution clear.'}
        </h2>
        <p>
          {signup
            ? 'Set up your merchant workspace in minutes, connect a PayPal Sandbox account, and review your first sample case.'
            : 'Return to your payment overview, understand customer concerns, and keep every decision transparent.'}
        </p>
        <div className="auth-benefits">
          <div>
            <span>
              <Icon name="spark" />
            </span>
            <p>
              <b>Explainable AI analysis</b>
              <small>Simple summaries with visible supporting reasons.</small>
            </p>
          </div>
          <div>
            <span>
              <Icon name="shield" />
            </span>
            <p>
              <b>Merchant-controlled refunds</b>
              <small>Nothing is submitted without your confirmation.</small>
            </p>
          </div>
          <div>
            <span>
              <Icon name="history" />
            </span>
            <p>
              <b>Accountable by design</b>
              <small>Important case actions stay visible in one audit log.</small>
            </p>
          </div>
        </div>
      </div>
      <div className="auth-quote">
        <div className="quote-mark">“</div>
        <p>FairPay gives our support team a clear path from complaint to customer resolution.</p>
        <span>
          <Avatar initials="JM" />
          <span>
            <b>Jordan Mitchell</b>
            <small>Operations Lead · Sample merchant</small>
          </span>
        </span>
      </div>
    </aside>
  )
}

function LoginPage({
  role,
  setRole,
  setScreen,
}: {
  role: AppRole
  setRole: (role: AppRole) => void
  setScreen: (screen: AuthScreen) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const result = await loginAction({ email, password, role })
      if (!result.success) {
        setError(result.error)
        return
      }
      window.location.assign(result.redirectTo)
    } catch {
      setError('Sign-in is temporarily unavailable. Please try again.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="auth-page">
      <PublicHeader screen="login" setScreen={setScreen} />
      <div className="auth-layout">
        <AuthAside signup={false} />
        <main className="auth-main">
          <div className="auth-card">
            <div className="auth-heading">
              <span className="auth-mobile-logo">
                <Logo />
              </span>
              <h1>Welcome back</h1>
              <p>
                Sign in to continue to your FairPay AI{' '}
                {role === 'merchant' ? 'merchant workspace' : 'customer account'}.
              </p>
            </div>
            <form onSubmit={submit}>
              {error && (
                <div className="form-error">
                  <Icon name="alert" size={16} />
                  {error}
                </div>
              )}
              <fieldset className="role-choice login-role-choice">
                <legend>Sign in as</legend>
                <button
                  type="button"
                  className={role === 'merchant' ? 'active' : ''}
                  aria-pressed={role === 'merchant'}
                  disabled={pending}
                  onClick={() => {
                    setRole('merchant')
                    setError('')
                  }}
                >
                  <span>
                    <Icon name="card" size={18} />
                  </span>
                  <b>Merchant</b>
                  <small>Manage payments and resolutions</small>
                </button>
                <button
                  type="button"
                  className={role === 'customer' ? 'active' : ''}
                  aria-pressed={role === 'customer'}
                  disabled={pending}
                  onClick={() => {
                    setRole('customer')
                    setError('')
                  }}
                >
                  <span>
                    <Icon name="users" size={18} />
                  </span>
                  <b>Customer</b>
                  <small>Track payments and complaints</small>
                </button>
              </fieldset>
              <label>
                Email address
                <div className="auth-input">
                  <Icon name="users" size={17} />
                  <input
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
              </label>
              <label>
                Password
                <div className="auth-input">
                  <Icon name="shield" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
              <div className="auth-options">
                <button
                  type="button"
                  onClick={() =>
                    notify('Password reset is not available yet. Please contact support.')
                  }
                >
                  Forgot password?
                </button>
              </div>
              <Button disabled={pending}>
                {pending
                  ? 'Signing in…'
                  : `Sign in as ${role === 'merchant' ? 'merchant' : 'customer'}`}
              </Button>
            </form>
            <p className="auth-switch">
              New to FairPay AI? <button onClick={() => setScreen('signup')}>Create account</button>
            </p>
            <div className="auth-demo-note">
              <Icon name="shield" size={15} />
              <span>
                <b>Role-protected access</b>
                <small>You will be sent to the dashboard assigned to your account.</small>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SignupPage({ setScreen }: { setScreen: (screen: AuthScreen) => void }) {
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(true)
  const [role, setRole] = useState<AppRole>('merchant')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (
      !name ||
      (role === 'merchant' && !business) ||
      !email.includes('@') ||
      password.length < 8 ||
      !agreed
    ) {
      setError('Complete every field, use an 8-character password, and accept the terms.')
      return
    }
    setPending(true)
    setError('')
    const result = await signupAction({ businessName: business, email, name, password, role })
    setPending(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    window.location.assign(result.redirectTo)
  }
  return (
    <div className="auth-page">
      <PublicHeader screen="signup" setScreen={setScreen} />
      <div className="auth-layout">
        <AuthAside signup />
        <main className="auth-main signup-main">
          <div className="auth-card">
            <div className="auth-heading">
              <span className="auth-mobile-logo">
                <Logo />
              </span>
              <span className="signup-step">STEP 1 OF 4 · CREATE PROFILE</span>
              <h1>Create your workspace</h1>
              <p>Start with a secure sample workspace. You can connect PayPal Sandbox next.</p>
            </div>
            <div className="signup-progress">
              <i className="active" />
              <i />
              <i />
              <i />
            </div>
            <form onSubmit={submit}>
              {error && (
                <div className="form-error">
                  <Icon name="alert" size={16} />
                  {error}
                </div>
              )}
              <fieldset className="role-choice">
                <legend>I am joining as</legend>
                <button
                  type="button"
                  className={role === 'merchant' ? 'active' : ''}
                  onClick={() => setRole('merchant')}
                >
                  <span>
                    <Icon name="card" size={18} />
                  </span>
                  <b>Merchant</b>
                  <small>Manage payments and resolutions</small>
                </button>
                <button
                  type="button"
                  className={role === 'customer' ? 'active' : ''}
                  onClick={() => setRole('customer')}
                >
                  <span>
                    <Icon name="users" size={18} />
                  </span>
                  <b>Customer</b>
                  <small>Track payments and complaints</small>
                </button>
              </fieldset>
              <div className={`auth-field-grid ${role === 'customer' ? 'single' : ''}`}>
                <label>
                  Full name
                  <div className="auth-input">
                    <Icon name="users" size={17} />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Alex Morgan"
                    />
                  </div>
                </label>
                {role === 'merchant' && (
                  <label>
                    Business name
                    <div className="auth-input">
                      <Icon name="card" size={17} />
                      <input
                        value={business}
                        onChange={(event) => setBusiness(event.target.value)}
                        placeholder="Your store"
                      />
                    </div>
                  </label>
                )}
              </div>
              <label>
                Work email
                <div className="auth-input">
                  <Icon name="users" size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
              </label>
              <label>
                Create password
                <div className="auth-input">
                  <Icon name="shield" size={17} />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                <small className="password-hint">
                  Use 8 or more characters with a mix of letters and numbers.
                </small>
              </label>
              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <span>
                  I agree to the <button type="button">Terms</button> and{' '}
                  <button type="button">Privacy Policy</button>.
                </span>
              </label>
              <Button disabled={pending}>
                {pending
                  ? 'Creating account…'
                  : role === 'merchant'
                    ? 'Create merchant workspace'
                    : 'Create customer account'}
              </Button>
            </form>
            <p className="auth-switch">
              Already have an account? <button onClick={() => setScreen('login')}>Log in</button>
            </p>
            <div className="auth-secure">
              <Icon name="shield" size={15} />
              Your information is encrypted and never shared without permission.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function FairPayApp({ initialUser = null }: { initialUser?: AppUser | null }) {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('landing')
  const [loginRole, setLoginRole] = useState<AppRole>('merchant')
  const [authenticated] = useState(Boolean(initialUser))
  const [page, setPage] = useState<Page>('overview')
  const [menu, setMenu] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [modal, setModal] = useState<'confirm' | 'success' | null>(null)
  const [portal, setPortal] = useState(false)
  const [toast, setToast] = useState('')
  useEffect(() => {
    let timer = 0
    const handleNotification = (event: Event) => {
      setToast((event as CustomEvent<string>).detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setToast(''), 2600)
    }
    window.addEventListener('fairpay-notify', handleNotification)
    return () => {
      window.removeEventListener('fairpay-notify', handleNotification)
      window.clearTimeout(timer)
    }
  }, [])
  const pageContent = useMemo(() => {
    if (page === 'overview') return <Overview navigate={setPage} />
    if (page === 'transactions') return <Transactions openDrawer={() => setDrawer(true)} />
    if (page === 'resolution') return <Resolution approve={() => setModal('confirm')} />
    if (page === 'refunds') return <Refunds approve={() => setModal('confirm')} />
    if (page === 'customers') return <Customers />
    if (page === 'analytics') return <Analytics />
    if (page === 'activity') return <ActivityLog />
    return <Settings />
  }, [page])

  if (portal)
    return (
      <CustomerPortal
        exit={() => {
          setPortal(false)
          setAuthScreen('landing')
        }}
      />
    )

  if (!authenticated) {
    if (authScreen === 'login') {
      return (
        <>
          <LoginPage role={loginRole} setRole={setLoginRole} setScreen={setAuthScreen} />
          {toast && (
            <div className="toast" role="status">
              <span>
                <Icon name="check" size={16} />
              </span>
              {toast}
            </div>
          )}
        </>
      )
    }
    if (authScreen === 'signup') {
      return <SignupPage setScreen={setAuthScreen} />
    }
    return (
      <LandingPage
        setScreen={setAuthScreen}
        setLoginRole={setLoginRole}
        openPortal={() => {
          setPortal(true)
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        open={menu}
        setOpen={setMenu}
        userName={initialUser?.name ?? 'Alex Morgan'}
      />
      {menu && <div className="mobile-overlay" onClick={() => setMenu(false)} />}
      <Topbar
        page={page}
        setPage={setPage}
        setMenu={setMenu}
        userName={initialUser?.name ?? 'Alex Morgan'}
        onLogout={async () => {
          await logoutAction()
          window.location.assign('/')
        }}
      />
      <main className="content">{pageContent}</main>
      <button className="portal-launch" onClick={() => setPortal(true)}>
        <Icon name="external" size={16} />
        Customer portal
      </button>
      {drawer && <TransactionDrawer close={() => setDrawer(false)} navigate={setPage} />}
      {modal === 'confirm' && (
        <RefundModal close={() => setModal(null)} confirm={() => setModal('success')} />
      )}
      {modal === 'success' && <SuccessModal close={() => setModal(null)} navigate={setPage} />}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}
