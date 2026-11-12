import { redirect } from 'next/navigation'
import CustomerShell from '@/components/CustomerShell'
import { appAuth } from '@/lib/app-auth'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await appAuth.currentUser()
  if (!user) redirect('/')
  if (user.role !== 'customer') redirect('/merchant')
  return <CustomerShell user={user}>{children}</CustomerShell>
}
