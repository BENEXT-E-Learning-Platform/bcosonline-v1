// app/login/page.tsx
import { redirect } from 'next/navigation'
import LoginForm from './_components/LoginForm'
import { getClient } from '../(authenticated)/_actions/getClient'


export default async function Page() {
  // Fetch the user using the getClient function
  const user = await getClient()

  // If the user is logged in, redirect them to the dashboard
  if (user) {
    redirect('/')
  }

  // If the user is not logged in, show the LoginForm
  return (
    <div className="h-[calc(100vh-3rem)]">
      <LoginForm />
    </div>
  )
}