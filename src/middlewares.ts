import { Response, Request, NextFunction } from 'express'
import httpContext from 'express-http-context'

import { User } from './user'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(' http context ', httpContext.get('user'))
    const token = req.headers.authorization
    if (token) {
      const currentUser = await User.findByToken(token)
      if (!currentUser) {
        console.log('not auth ', currentUser, ' token = ', token)
        throw new Error('Not authorized')
      }
      console.log('currentUser = ', currentUser, 'token = ', token)
      httpContext.set('user', currentUser)
      next()
    }
    throw new Error('Not authorized')
  } catch (e) {
    res.status(403).send('Not authorized').end()
  }
}

export const differenceInSeconds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startTime: number = new Date().getTime()
    res.on('finish', () => {
      const endTime: number = new Date().getTime()
      const diff: number = (endTime - startTime) / 1000
      console.log('request duration: ', diff + 's')
    })

    next()
  } catch (e) {
    res.status(500).end()
  }
}
