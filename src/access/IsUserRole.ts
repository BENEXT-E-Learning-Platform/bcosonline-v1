import type { Access, AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isSuperAdmin = (args: AccessArgs<User>) => boolean

export const isSuperAdmin: isSuperAdmin = ({ req: { user } }) => {
  if((user as User)?.roles?.includes('superadmin')) {
    return true
  }
    return false
}


type isManager = (args: AccessArgs<User>) => boolean


export const isManager: isManager = ({ req: { user } }) => {
 if((user as User)?.roles?.includes('manager')) {
   return true
 }
 return false
}


type isProduction = (args: AccessArgs<User>) => boolean

export const isProduction: isProduction = ({ req: { user } }) => {
  if((user as User)?.roles?.includes('production')) {
    return true
  }
  return false
 }

type isCommerciale = (args: AccessArgs<User>) => boolean

export const isCommerciale: isCommerciale = ({ req: { user } }) => {
  if((user as User)?.roles?.includes('commerciale')) {
    return true
  } 
  return false
}

type isMarketing = (args: AccessArgs<User>) => boolean

export const isMarketing: isMarketing = ({ req: { user } }) => {
  if((user as User)?.roles?.includes('marketing')) {
    return true
  }
  return false
}


type isInternalUser = (args: AccessArgs<User>) => boolean
// create a type to check if user is from Users collection and has roles
export const isInternalUser: isInternalUser = ({ req: { user } }) => {
  if((user as User)?.roles) {
    return true
  }
  return false
} 



type isSuperAdminOrManager = (args: AccessArgs<User>) => boolean

export const isSuperAdminOrManager: isSuperAdminOrManager = ({ req: { user } }) => {
  if((user as User)?.roles?.includes('manager') || (user as User)?.roles?.includes('superadmin')) {
    return true
  }
  return false
}