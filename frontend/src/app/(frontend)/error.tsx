'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from './actions'

export default function FrontendError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const router = useRouter()

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f5f7fa] p-6 text-[#172b4d]">
      <section className="w-full max-w-md rounded-[14px] border border-[#e4e7ec] bg-white p-8 text-center shadow-[0_18px_44px_rgba(16,24,40,.12)]">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[#eaf5fc] text-xl font-bold text-[#003087]">
          !
        </span>
        <h1 className="mt-5 text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-[12px] leading-5 text-[#667085]">
          Retry this page, or sign out if the problem continues.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="min-h-10 rounded-lg bg-[#003087] px-4 text-[10px] font-bold text-white"
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
          <button
            className="min-h-10 rounded-lg border border-[#d0d5dd] bg-white px-4 text-[10px] font-bold"
            onClick={async () => {
              await logoutAction()
              router.push('/')
              router.refresh()
              unstable_retry()
            }}
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  )
}
