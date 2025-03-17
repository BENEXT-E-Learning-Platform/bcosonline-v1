import React, { ReactElement } from 'react'
import SignupForm from './_components/SignupForm'
import HeaderServer from '../header/ClientHeader'
import ClientHeader from '../header/ClientHeader'

export default async function Page(): Promise<ReactElement> {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <ClientHeader />
      <SignupForm />
    </div>
  )
}
