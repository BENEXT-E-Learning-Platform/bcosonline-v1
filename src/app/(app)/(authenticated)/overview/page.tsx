import { redirect } from 'next/navigation'

export default function OverviewPage() {
  redirect('/dashboard')
  return null
}
