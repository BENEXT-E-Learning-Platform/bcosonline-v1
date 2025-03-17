// // server/api/dashboard-stats.ts

// import { Response, NextFunction } from 'express'
// import { PayloadRequest } from 'payload'

// export const getDashboardStats = async (
//   req: PayloadRequest,
//   res: Response,
//   _next: NextFunction,
// ) => {
//   try {
//     // Check if user is authenticated and has permissions
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     // Get the Payload instance
//     const payload = req.payload

//     // Get counts from collections
//     const [
//       userCount,
//       individualAccountCount,
//       businessAccountCount,
//       courseCount,
//       participationCount,
//       certificatesCount,
//     ] = await Promise.all([
//       payload.find({ collection: 'users', limit: 0 }).then((res) => res.totalDocs),
//       payload.find({ collection: 'individualAccount', limit: 0 }).then((res) => res.totalDocs),
//       payload.find({ collection: 'BusinessAcounts', limit: 0 }).then((res) => res.totalDocs),
//       payload.find({ collection: 'courses', limit: 0 }).then((res) => res.totalDocs),
//       payload.find({ collection: 'participation', limit: 0 }).then((res) => res.totalDocs),
//       payload.find({ collection: 'certificates', limit: 0 }).then((res) => res.totalDocs),
//     ])

//     // Mock data for the missing calculations to match the expected interface
//     const mockParticipationTrend = [
//       { name: 'Oct', count: 20 },
//       { name: 'Nov', count: 25 },
//       { name: 'Dec', count: 30 },
//       { name: 'Jan', count: 35 },
//       { name: 'Feb', count: 40 },
//       { name: 'Mar', count: 45 },
//     ]

//     // Build the comprehensive statistics response
//     return res.status(200).json({
//       // Core metrics
//       users: userCount || 0,
//       individualAccounts: individualAccountCount || 0,
//       businessAccounts: businessAccountCount || 0,
//       courses: courseCount || 0,

//       // KPIs
//       activeEnrollments: participationCount || 0,
//       completionRate: '75.0', // Mock value
//       avgCourseRating: '4.5', // Mock value
//       certificatesIssued: certificatesCount || 0,
//       userGrowthRate: 12.5, // Mock value

//       // Charts data
//       participationTrend: mockParticipationTrend,
//       stats: [
//         { name: 'Users', count: userCount || 0 },
//         { name: 'Individual Clients', count: individualAccountCount || 0 },
//         { name: 'Business Clients', count: businessAccountCount || 0 },
//         { name: 'Courses', count: courseCount || 0 },
//         { name: 'Active Enrollments', count: participationCount || 0 },
//       ],

//       // Distribution data (for pie chart)
//       accountDistribution: [
//         { name: 'Individual', value: individualAccountCount || 0 },
//         { name: 'Business', value: businessAccountCount || 0 },
//       ],
//     })
//   } catch (error) {
//     console.error('Error fetching dashboard stats:', error)
//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }

// export default getDashboardStats
