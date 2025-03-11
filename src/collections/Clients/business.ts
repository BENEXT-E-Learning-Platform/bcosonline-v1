import type { CollectionConfig } from 'payload'

export const businessAcounts: CollectionConfig = {
  slug: 'BusinessAcounts',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'fieldOfWork', 'phone'],
    group: 'Clients',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
  auth: true,
  fields: [
    // Basic Information
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
    // Course Participation
    {
      name: 'participation',
      label: 'Participation',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },
    // Additional Fields
    {
      name: 'agreeToTerms',
      label: 'Terms and Conditions',
      type: 'checkbox',
      required: true,
      admin: {
        description: 'User agrees to the terms and conditions',
      },
    },
    {
      name: 'marketingConsent',
      label: 'Marketing Consent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'User agrees to receive marketing emails and WhatsApp messages',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default businessAcounts
