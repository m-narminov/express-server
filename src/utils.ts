import fs from 'fs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { User } from './user'

export const usersFile: string = 'assets/users.json'
export const filesPath: string = 'uploads/'
export const expirationTime = '4h' // must be 4h

export interface UserContent {
  users: User[]
  currentId: number
}
export interface emailPassword {
  email: string
  password: string
}

export const getFileContent = async (fileName: string) => {
  const usersContent = await fs.promises.readFile(fileName, {
    encoding: 'utf8',
  })
  let result: UserContent = JSON.parse(usersContent)
  return result
}

export const setFileContent = (
  fileName: string,
  content: UserContent
): void => {
  fs.writeFile(fileName, JSON.stringify(content, null, 2), err => {
    if (err) throw err
  })
}

export const createPassword = (passwordStr: string): string =>
  crypto.createHash('md5').update(passwordStr).digest('hex')

export const createToken = (
  payload: string | object | Buffer,
  secret: jwt.Secret,
  options?: jwt.SignOptions | undefined
): string => jwt.sign(payload, secret, options)

export const validateUser = (user: User): boolean | void => {
  if (!user.name) throw new Error('Name is required')
  if (!user.email) throw new Error('Email is required')
  if (!user.password) throw new Error('Password is required')
  return true
}

export const isSameUser = (userA: User, userB: User): boolean =>
  !!validateUser(userA) &&
  !!validateUser(userB) &&
  userA.name === userB.name &&
  userA.email === userB.email &&
  userA.password === userB.password
