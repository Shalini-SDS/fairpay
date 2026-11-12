import Link from 'next/link'
import { appAuth } from '@/lib/app-auth'

const timeline = [
  { label: 'Complaint received', detail: 'Today, 9:42 AM', done: true },
  { label: 'Merchant reviewing', detail: 'Usually within 1–2 business days', current: true },
  { label: 'Resolution proposed', detail: 'We will email you with an update' },
  { label: 'Completed', detail: 'Final outcome confirmed' },
]

export default async function CustomerHomePage() {
  const user = await appAuth.currentUser()

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[.08em] text-[#009cde]">CUSTOMER HOME</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-.6px] text-[#172b4d]">
            Hi {user?.name.split(' ')[0]}, how can we help?
          </h1>
          <p className="mt-2 text-[12px] text-[#667085]">
            Track your concerns and find updates in one simple place.
          </p>
        </div>
        <Link
          href="/customer/complaints"
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#003087] px-4 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(0,48,135,.2)]"
        >
          Report a payment issue
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Open complaints', '1', 'The merchant is reviewing your case', '#eaf5fc', '#003087'],
          ['Recent payments', '3', 'Payments in the last 90 days', '#f2f4f7', '#475467'],
          ['Completed refunds', '1', '$60.00 returned successfully', '#ecfdf3', '#16865a'],
        ].map(([label, value, detail, background, color]) => (
          <article
            key={label}
            className="rounded-[13px] border border-[#e4e7ec] bg-gradient-to-br from-white to-[#f8fbfd] p-5 shadow-[0_4px_14px_rgba(16,24,40,.05)]"
          >
            <span
              className="mb-4 grid size-9 place-items-center rounded-lg text-[14px] font-bold"
              style={{ background, color }}
            >
              {label === 'Open complaints' ? '◇' : label === 'Recent payments' ? '▣' : '✓'}
            </span>
            <p className="text-[10px] text-[#667085]">{label}</p>
            <strong className="my-1.5 block text-[24px]">{value}</strong>
            <small className="text-[9px] text-[#667085]">{detail}</small>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-[13px] border border-[#e4e7ec] bg-white p-5 shadow-[0_4px_14px_rgba(16,24,40,.05)]">
          <div className="flex items-start justify-between border-b border-[#e4e7ec] pb-4">
            <div>
              <p className="text-[9px] font-bold tracking-[.08em] text-[#667085]">CASE FP-1024</p>
              <h2 className="mt-1 text-[16px] font-semibold">Order has not arrived</h2>
              <p className="mt-1 text-[10px] text-[#667085]">Wireless headphones · $100.00</p>
            </div>
            <span className="rounded-full bg-[#eff8ff] px-2.5 py-1 text-[9px] font-bold text-[#175cd3]">
              Merchant reviewing
            </span>
          </div>
          <div className="mt-5">
            {timeline.map((item, index) => (
              <div key={item.label} className="relative flex min-h-[64px] gap-3">
                {index < timeline.length - 1 && (
                  <span
                    className={`absolute left-[14px] top-7 h-[40px] w-[2px] ${item.done ? 'bg-[#16865a]' : 'bg-[#e4e7ec]'}`}
                  />
                )}
                <span
                  className={`z-10 grid size-7 flex-none place-items-center rounded-full border-2 text-[9px] font-bold ${
                    item.done
                      ? 'border-[#16865a] bg-[#16865a] text-white'
                      : item.current
                        ? 'border-[#009cde] bg-white text-[#003087] shadow-[0_0_0_4px_#eaf5fc]'
                        : 'border-[#d0d5dd] bg-white text-[#98a2b3]'
                  }`}
                >
                  {item.done ? '✓' : index + 1}
                </span>
                <span className="grid content-start gap-1 pt-0.5">
                  <b className="text-[11px]">{item.label}</b>
                  <small className="text-[9px] text-[#667085]">{item.detail}</small>
                </span>
              </div>
            ))}
          </div>
          <Link href="/customer/complaints" className="text-[10px] font-bold text-[#005ea6]">
            View full case details →
          </Link>
        </section>

        <div className="grid content-start gap-5">
          <section className="rounded-[13px] bg-gradient-to-br from-[#06458f] to-[#00245f] p-5 text-white shadow-[0_16px_35px_rgba(0,48,135,.18)]">
            <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-lg">?</span>
            <h2 className="mt-4 text-[15px] font-semibold">Have another concern?</h2>
            <p className="mt-2 text-[10px] leading-5 text-[#c9d9eb]">
              Tell us what happened using plain language. We will send it securely to the merchant.
            </p>
            <Link
              href="/customer/complaints"
              className="mt-4 inline-flex min-h-9 items-center rounded-lg bg-white px-3 text-[10px] font-bold text-[#003087]"
            >
              Start a complaint
            </Link>
          </section>
          <section className="rounded-[13px] border border-[#e4e7ec] bg-white p-5 shadow-[0_4px_14px_rgba(16,24,40,.05)]">
            <h2 className="text-[13px] font-semibold">Latest payment</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="grid gap-1">
                <b className="text-[10px]">Wireless headphones</b>
                <small className="text-[9px] text-[#667085]">PAY-82001 · May 24</small>
              </span>
              <b className="text-[12px]">$100.00</b>
            </div>
            <Link
              href="/customer/payments"
              className="mt-4 block border-t border-[#e4e7ec] pt-3 text-[10px] font-bold text-[#005ea6]"
            >
              View payment history →
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
