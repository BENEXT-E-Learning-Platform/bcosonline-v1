'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'
import { IndividualAccount } from '@/payload-types'

export async function getClient(): Promise<IndividualAccount | null> {
  const headers = await getHeaders()
  const payload: Payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers })
  return (user?.collection === 'individualAccount' ? user : null) as IndividualAccount | null
}
