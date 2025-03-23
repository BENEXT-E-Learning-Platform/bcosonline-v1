import type { CollectionConfig } from 'payload'

export const individualAccount: CollectionConfig = {
  slug: 'individualAccount',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'fieldOfWork', 'phone'],
    group: 'Clients',
  },
  access: {
    create: () => true, // Anyone can sign up
    read: ({ req: { user } }) => (user ? { id: { equals: user.id.toString() } } : false), // Only read own data
    update: ({ req: { user } }) => (user ? { id: { equals: user.id.toString() } } : false), // Only update own data
  },
  auth: {
    verify: false,
    tokenExpiration: 7200, // 2 hours
    cookies: {
      secure: process.env.NODE_ENV === 'production',
    },
    useAPIKey: false,
    depth: 0,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      unique: true,
      required: true,
      index: true,
    },
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'fieldOfWork',
      label: 'Field of Work',
      type: 'select',
      options: [
        { label: 'الإدارة والتسيير / La gestion', value: 'management' },
        {
          label: 'المالية والمحاسبة والجباية / Finance & Comptabilité & Fiscalité',
          value: 'finance',
        },
        { label: 'التسويق والمبيعات / Marketing & Commercial', value: 'marketing' },
        { label: 'الديجيتال / Digital', value: 'digital' },
        { label: 'التموين واللوجيستيك / Approvisionnement & Logistique', value: 'logistics' },
        { label: 'الموارد البشرية / Ressources humaines', value: 'hr' },
        { label: 'الإنتاج والعمليات / Production & Processus', value: 'production' },
        { label: 'نظام المعلومات / IT', value: 'it' },
        { label: 'الوقاية والأمن / HSE', value: 'safety' },
      ],
      required: true,
    },
    {
      name: 'agreeToTerms',
      label: 'Terms and Conditions',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'marketingConsent',
      label: 'Marketing Consent',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'active',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}

export default individualAccount
