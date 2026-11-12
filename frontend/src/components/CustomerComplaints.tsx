'use client'

import { useState } from 'react'

const cases = [
  {
    id: 'FP-1024',
    issue: 'Order has not arrived',
    payment: 'PAY-82001',
    amount: '$100.00',
    date: 'May 24, 2025',
    status: 'Merchant reviewing',
  },
  {
    id: 'FP-0982',
    issue: 'Refund for damaged item',
    payment: 'PAY-81452',
    amount: '$60.00',
    date: 'April 12, 2025',
    status: 'Completed',
  },
]

export default function CustomerComplaints() {
  const [creating, setCreating] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (creating) {
    return (
      <section className="mx-auto max-w-2xl rounded-[14px] border border-[#e4e7ec] bg-white p-6 shadow-[0_12px_30px_rgba(0,48,135,.08)]">
        <button
          className="mb-5 text-[10px] font-bold text-[#005ea6]"
          onClick={() => setCreating(false)}
        >
          ← Back to my complaints
        </button>
        {submitted ? (
          <div className="py-10 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#ecfdf3] text-2xl font-bold text-[#16865a]">
              ✓
            </span>
            <h2 className="mt-5 text-[20px] font-semibold">Your complaint was received</h2>
            <p className="mt-2 text-[11px] text-[#667085]">
              Your sample case reference is <b className="text-[#003087]">FP-1027</b>.
            </p>
            <button
              className="mt-6 rounded-lg bg-[#003087] px-4 py-2.5 text-[10px] font-bold text-white"
              onClick={() => {
                setSubmitted(false)
                setCreating(false)
              }}
            >
              Return to complaints
            </button>
          </div>
        ) : (
          <>
            <p className="text-[9px] font-bold tracking-[.1em] text-[#009cde]">NEW COMPLAINT</p>
            <h1 className="mt-2 text-[23px] font-semibold">Tell us what happened</h1>
            <p className="mt-2 text-[11px] text-[#667085]">
              Keep it simple. The merchant will review the payment and your message.
            </p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
              }}
            >
              <label className="grid gap-2 text-[10px] font-semibold">
                Payment
                <select
                  required
                  className="h-11 rounded-lg border border-[#d0d5dd] bg-white px-3 text-[11px] outline-none focus:border-[#009cde]"
                >
                  <option value="">Choose a payment</option>
                  <option>PAY-82001 · Wireless headphones · $100.00</option>
                  <option>PAY-81948 · Phone case · $42.00</option>
                </select>
              </label>
              <label className="grid gap-2 text-[10px] font-semibold">
                What is the issue?
                <select
                  required
                  className="h-11 rounded-lg border border-[#d0d5dd] bg-white px-3 text-[11px] outline-none focus:border-[#009cde]"
                >
                  <option>My order has not arrived</option>
                  <option>I was charged incorrectly</option>
                  <option>I want to request a refund</option>
                  <option>Something else</option>
                </select>
              </label>
              <label className="grid gap-2 text-[10px] font-semibold">
                Describe the problem
                <textarea
                  required
                  minLength={20}
                  className="min-h-32 rounded-lg border border-[#d0d5dd] p-3 text-[11px] leading-5 outline-none focus:border-[#009cde]"
                  placeholder="Tell the merchant what happened and what outcome you would like."
                />
              </label>
              <div className="rounded-lg bg-[#eff8ff] p-3 text-[9px] leading-4 text-[#475467]">
                Your message is shared only with the merchant responsible for this payment.
              </div>
              <button className="min-h-11 rounded-lg bg-[#003087] text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(0,48,135,.2)]">
                Submit complaint
              </button>
            </form>
          </>
        )}
      </section>
    )
  }

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[.08em] text-[#009cde]">MY COMPLAINTS</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-.6px]">Payment concerns</h1>
          <p className="mt-2 text-[12px] text-[#667085]">
            See updates or tell the merchant about a new issue.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="min-h-10 rounded-lg bg-[#003087] px-4 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(0,48,135,.2)]"
        >
          New complaint
        </button>
      </div>
      <div className="grid gap-4">
        {cases.map((item) => (
          <article
            key={item.id}
            className="rounded-[13px] border border-[#e4e7ec] bg-white p-5 shadow-[0_4px_14px_rgba(16,24,40,.05)]"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-[#eaf5fc] text-lg text-[#003087]">
                  ◇
                </span>
                <span className="grid gap-1">
                  <small className="text-[8px] font-bold tracking-[.08em] text-[#667085]">
                    {item.id}
                  </small>
                  <b className="text-[13px]">{item.issue}</b>
                  <small className="text-[9px] text-[#667085]">
                    {item.payment} · {item.date} · {item.amount}
                  </small>
                </span>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  item.status === 'Completed'
                    ? 'bg-[#ecfdf3] text-[#16865a]'
                    : 'bg-[#eff8ff] text-[#175cd3]'
                }`}
              >
                {item.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
