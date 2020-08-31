import { RequestHandler, Response, Request, NextFunction } from 'express'

import { User } from './user'

export const checkAuth: Function = () => {}

export const differenceInSeconds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime: number = new Date().getTime()
  console.log('startTime: ', startTime)
  res.on('finish', () => {
    const endTime: number = new Date().getTime()
    const diff: number = (endTime - startTime) / 1000
    console.log('request seconds: ', diff)
  })

  next()
}
