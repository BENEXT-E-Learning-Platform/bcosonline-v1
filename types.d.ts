// ...existing code...
type PayloadHandler = (
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
  payload: any,
) => Promise<void>
// ...existing code...
