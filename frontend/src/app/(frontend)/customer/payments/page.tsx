'use client'

import { useState } from 'react'

const payments = [
  ['PAY-82001', 'Wireless headphones', 'May 24, 2025', '$100.00', 'Completed'],
  ['PAY-81948', 'Phone case', 'May 4, 2025', '$42.00', 'Completed'],
  ['PAY-81452', 'Bluetooth speaker', 'April 12, 2025', '$60.00', 'Refunded'],
]

export default function CustomerPaymentsPage() {
  const [query, setQuery] = useState('')
  const visiblePayments = payments.filter((payment) =>
    payment.join(' ').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <div className="mb-7">
        <p className="text-[10px] font-bold tracking-[.08em] text-[#009cde]">MY PAYMENTS</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-.6px]">Payment history</h1>
        <p className="mt-2 text-[12px] text-[#667085]">
          Find a payment and see whether it has a related complaint or refund.
        </p>
      </div>
      <section className="overflow-hidden rounded-[13px] border border-[#e4e7ec] bg-white shadow-[0_4px_14px_rgba(16,24,40,.05)]">
        <div className="border-b border-[#e4e7ec] p-4">
          <label className="flex h-10 max-w-sm items-center gap-2 rounded-lg border border-[#d0d5dd] px-3 text-[#98a2b3]">
            <span>⌕</span>
            <input
              className="w-full border-0 bg-transparent text-[10px] text-[#172b4d] outline-none"
              placeholder="Search payments"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#fcfcfd] text-[8px] tracking-[.05em] text-[#667085]">
                <th className="px-5 py-3">PAYMENT</th>
                <th className="px-5 py-3">ITEM</th>
                <th className="px-5 py-3">DATE</th>
                <th className="px-5 py-3">AMOUNT</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((payment) => (
                <tr key={payment[0]} className="border-t border-[#f0f1f3] text-[10px]">
                  <td className="px-5 py-4 font-bold text-[#005ea6]">{payment[0]}</td>
                  <td className="px-5 py-4">{payment[1]}</td>
                  <td className="px-5 py-4 text-[#667085]">{payment[2]}</td>
                  <td className="px-5 py-4 font-semibold">{payment[3]}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                        payment[4] === 'Refunded'
                          ? 'bg-[#f2f4f7] text-[#667085]'
                          : 'bg-[#ecfdf3] text-[#16865a]'
                      }`}
                    >
                      {payment[4]}
                    </span>
                  </td>
                </tr>
              ))}
              {visiblePayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[10px] text-[#667085]">
                    No payments match “{query}”. Try another payment ID or item name.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
