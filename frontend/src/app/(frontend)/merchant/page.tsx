import { redirect } from 'next/navigation'
import FairPayApp from '@/components/FairPayApp'
import { appAuth } from '@/lib/app-auth'

export default async function MerchantPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/')
  if (user.role !== 'merchant') redirect('/customer')
  return <FairPayApp initialUser={user} />
}
