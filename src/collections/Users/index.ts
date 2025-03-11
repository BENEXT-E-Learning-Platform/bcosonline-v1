// collections/Users.ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isSuperAdmin } from '@/access/IsUserRole'
import payload from 'payload'
import individualAccount from '@/collections/Clients/individual' // Fixed typo

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: isSuperAdmin,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      access: { create: () => true, read: () => true, update: () => true },
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Production', value: 'production' },
        { label: 'Commerciale', value: 'commerciale' },
        { label: 'Marketing', value: 'marketing' },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    afterOperation: [
      async ({ operation, req, result }) => {
        if (operation === 'create' && result && result.roles?.includes('manager')) {
          // Only for Managers
          try {
            console.log('Creating client for user:', result.id)
            const clientData = {
              email: result.email,
              firstName: result.name?.split(' ')[0] || '',
              lastName: result.name?.split(' ').slice(1).join(' ') || '',
              fullName: result.name || '',
              phone: '',
              address: { street: '', city: '', state: '', zipCode: '', country: '' },
              dateOfBirth: null,
              idNumber: '',
              assignedTo: result.id,
              isActive: true,
              fieldOfWork: 'management' as
                | 'management'
                | 'finance'
                | 'marketing'
                | 'digital'
                | 'logistics'
                | 'hr'
                | 'production'
                | 'it'
                | 'safety',
              agreeToTerms: true,
            }
            await payload.create({ collection: 'individualAccount', data: clientData, req })
            console.log('Client account created successfully')
          } catch (error) {
            console.error('Error creating client:', error)
          }
        }
      },
    ],
  },
}
