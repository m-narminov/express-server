import { Response, Request, NextFunction } from 'express'
import httpContext from 'express-http-context'

import { User } from './user'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization
    if (token) {
      const currentUser = await User.findByToken(token)
      httpContext.set('user', currentUser)
    }
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
