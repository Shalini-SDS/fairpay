import { redirect } from 'next/navigation'
import FairPayApp from '@/components/FairPayApp'
import { appAuth } from '@/lib/app-auth'

export default async function HomePage() {
  const user = await appAuth.currentUser()
  if (user?.role === 'merchant') redirect('/merchant')
  if (user?.role === 'customer') redirect('/customer')
  return <FairPayApp />
}
