import fs from 'fs'
import { User } from './user'

export const usersFile: string = 'assets/users.json'
export interface UserForFindOne {
  id?: number
  name?: string
  email?: string
  password?: string
  token?: string
  enabled?: boolean
}
export interface UserContent {
  users: User[]
  currentId: number
}
export interface emailPassword {
  email: string
  password: string
}

export const returnResult = (
  err: NodeJS.ErrnoException | null,
  data: string
) => {
  if (err) throw err
  return JSON.parse(data)
}

export const getFileContent = async (fileName: string) => {
  const usersContent = await fs.promises.readFile(fileName, {
    encoding: 'utf8',
  })
  let result: UserContent = JSON.parse(usersContent)
  return result
}

export const setFileContent = (fileName: string, content: UserContent) => {
  fs.writeFile(fileName, JSON.stringify(content, null, 2), err => {
    if (err) throw err
  })
}
