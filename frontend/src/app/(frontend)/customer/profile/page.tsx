import { appAuth } from '@/lib/app-auth'

export default async function CustomerProfilePage() {
  const user = await appAuth.currentUser()

  return (
    <>
      <div className="mb-7">
        <p className="text-[10px] font-bold tracking-[.08em] text-[#009cde]">PROFILE</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-.6px]">Your account</h1>
        <p className="mt-2 text-[12px] text-[#667085]">
          Review the details connected to your FairPay account.
        </p>
      </div>
      <section className="max-w-2xl rounded-[13px] border border-[#e4e7ec] bg-white p-6 shadow-[0_4px_14px_rgba(16,24,40,.05)]">
        <div className="flex items-center gap-4 border-b border-[#e4e7ec] pb-5">
          <span className="grid size-14 place-items-center rounded-full bg-[#dfeef9] text-[15px] font-bold text-[#003087]">
            {user?.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          <span className="grid gap-1">
            <b className="text-[15px]">{user?.name}</b>
            <small className="text-[10px] text-[#667085]">{user?.email}</small>
            <span className="mt-1 w-fit rounded-full bg-[#eaf5fc] px-2 py-1 text-[8px] font-bold text-[#003087]">
              Customer
            </span>
          </span>
        </div>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-[10px] font-semibold">
            Full name
            <input
              className="h-11 rounded-lg border border-[#d0d5dd] bg-[#f8fafc] px-3 text-[11px]"
              value={user?.name}
              readOnly
            />
          </label>
          <label className="grid gap-2 text-[10px] font-semibold">
            Email address
            <input
              className="h-11 rounded-lg border border-[#d0d5dd] bg-[#f8fafc] px-3 text-[11px]"
              value={user?.email}
              readOnly
            />
          </label>
          <div className="rounded-lg bg-[#eff8ff] p-3 text-[9px] leading-4 text-[#475467]">
            Contact support if you need to change the email address connected to your account.
          </div>
        </div>
      </section>
    </>
  )
}
