// 'use client'
// import React, { useEffect, useState } from 'react'
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from 'recharts'
// import { ArrowUpRight, ArrowDownRight, Award, User, Briefcase, BookOpen, Users } from 'lucide-react'

// // Define interfaces for stats data
// interface DashboardStats {
//   users: number
//   individualAccounts: number
//   businessAccounts: number
//   courses: number
//   activeEnrollments: number
//   completionRate: string
//   avgCourseRating: string
//   certificatesIssued: number
//   userGrowthRate: number
//   participationTrend: {
//     name: string
//     count: number
//   }[]
//   stats: {
//     name: string
//     count: number
//   }[]
//   accountDistribution: {
//     name: string
//     value: number
//   }[]
// }

// const Dashboard: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true)
//   const [stats, setStats] = useState<DashboardStats | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   // Fetch stats from your API endpoint
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await fetch('/api/dashboard-stats')
//         if (!response.ok) {
//           throw new Error('Failed to fetch dashboard stats')
//         }
//         const data = await response.json()
//         setStats(data)
//       } catch (err) {
//         setError('Error loading dashboard statistics')
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

//   if (loading) {
//     return <div className="p-8 text-center">Loading dashboard statistics...</div>
//   }

//   if (error || !stats) {
//     return (
//       <div className="p-8 text-center text-red-500">{error || 'Failed to load statistics'}</div>
//     )
//   }

//   // Colors for charts
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

//   return (
//     <div className="dashboard p-6">
//       <h1 className="text-3xl font-bold mb-6">Platform Analytics Dashboard</h1>

//       {/* Top KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <KpiCard
//           title="Total Users"
//           value={stats.users}
//           trend={stats.userGrowthRate}
//           trendLabel="growth"
//           icon={<User size={24} />}
//           color="#0088FE"
//         />
//         <KpiCard
//           title="Active Enrollments"
//           value={stats.activeEnrollments}
//           icon={<Users size={24} />}
//           color="#00C49F"
//         />
//         <KpiCard
//           title="Completion Rate"
//           value={`${stats.completionRate}%`}
//           icon={<Award size={24} />}
//           color="#FFBB28"
//         />
//         <KpiCard
//           title="Course Rating"
//           value={`${stats.avgCourseRating}/5`}
//           icon={<BookOpen size={24} />}
//           color="#FF8042"
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Enrollment Trend */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Enrollment Trend (Last 6 Months)</h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={stats.participationTrend}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#0088FE"
//                   name="Enrollments"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Account Distribution */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Account Distribution</h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={stats.accountDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {stats.accountDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`${value} accounts`, 'Count']} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Platform Statistics */}
//       <div className="bg-white p-6 rounded-lg shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
//         <div className="h-96">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={stats.stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#38BDF8">
//                 {stats.stats.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Additional KPIs */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold mb-2">Certificates Issued</h3>
//           <div className="text-3xl font-bold">{stats.certificatesIssued}</div>
//           <div className="mt-2 text-gray-500">Total certificates earned by users</div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold mb-2">Individual/Business Ratio</h3>
//           <div className="text-3xl font-bold">
//             {stats.individualAccounts > 0
//               ? (stats.businessAccounts / stats.individualAccounts).toFixed(2)
//               : '0.00'}
//           </div>
//           <div className="mt-2 text-gray-500">Business accounts per individual account</div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold mb-2">Avg Courses Per User</h3>
//           <div className="text-3xl font-bold">
//             {stats.users > 0 ? (stats.activeEnrollments / stats.users).toFixed(1) : '0.0'}
//           </div>
//           <div className="mt-2 text-gray-500">Course engagement metric</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // KPI Card component
// interface KpiCardProps {
//   title: string
//   value: number | string
//   trend?: number
//   trendLabel?: string
//   icon?: React.ReactNode
//   color?: string
// }

// const KpiCard: React.FC<KpiCardProps> = ({
//   title,
//   value,
//   trend,
//   trendLabel = 'change',
//   icon,
//   color = '#38BDF8',
// }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <div className="flex justify-between items-start mb-4">
//         <div className="text-lg font-semibold">{title}</div>
//         {icon && (
//           <div style={{ backgroundColor: `${color}20` }} className="p-2 rounded-full">
//             <div style={{ color }}>{icon}</div>
//           </div>
//         )}
//       </div>
//       <div className="text-3xl font-bold mb-2">{value}</div>
//       {trend !== undefined && (
//         <div className="flex items-center">
//           {trend >= 0 ? (
//             <span className="flex items-center text-green-500">
//               <ArrowUpRight size={16} className="mr-1" />
//               {trend.toFixed(1)}%
//             </span>
//           ) : (
//             <span className="flex items-center text-red-500">
//               <ArrowDownRight size={16} className="mr-1" />
//               {Math.abs(trend).toFixed(1)}%
//             </span>
//           )}
//           <span className="text-gray-500 ml-2">{trendLabel}</span>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Dashboard
