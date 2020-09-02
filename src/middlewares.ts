import { Response, Request, NextFunction } from 'express'

import { User } from './user'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
    if (token) User.findByToken(token)
    next()
  } catch (e) {
    res.status(403)
    res.end()
  }
}

export const differenceInSeconds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startTime: number = new Date().getTime()
    console.log('startTime: ', startTime)
    res.on('finish', () => {
      const endTime: number = new Date().getTime()
      const diff: number = (endTime - startTime) / 1000
      console.log('request seconds: ', diff)
    })

    next()
  } catch (e) {
    res.status(500).end()
  }
}
