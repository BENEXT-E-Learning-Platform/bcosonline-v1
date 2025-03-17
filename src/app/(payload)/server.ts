// // This should be in your main server file (e.g., server.ts or index.ts)
// import express, { Request } from 'express'
// import payload from 'payload'
// import { getDashboardStats } from './api/dashboard-stats'

// import { PayloadRequest } from 'payload/types
// ';

// interface CustomRequest extends PayloadRequest {
//   payload?: typeof payload;
// }

// const app = express()

// // Initialize Payload
// const start = async () => {
//   // Initialize Payload
//   await payload.init({
//     secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET_REPLACE_ME',
//     express: app,
//     onInit: async () => {
//       payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
//   app.get('/api/dashboard-stats', async (req: CustomRequest, res, next) => {
//   })

//   // Register custom API routes AFTER Payload has been initialized
//   app.get('/api/dashboard-stats', async (req: CustomRequest, res, next) => {
//     try {
//       // Attach the payload instance to the request object
//       req.payload = payload
//       await getDashboardStats(req, res, next)
//     } catch (error) {
//       next(error)
//     }
//   })

//   // Start the server
//   app.listen(3000, async () => {
//     payload.logger.info(`Server started on port 3000`)
// [;ly]  })
// }

// start()
