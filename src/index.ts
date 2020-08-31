import express, { Request, Response } from 'express'
import fs from 'fs'

import { differenceInSeconds } from './middlewares'
import { User } from './user'

export interface UserContent {
  users: User[]
  currentId: number
}

export let currentId: number = 0
export const usersFile: string = 'assets/users.json'
const app: express.Application = express()
const PORT: number = 3000

fs.readFile(usersFile, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  const usersContent: UserContent = JSON.parse(data.toString())
  if (usersContent.hasOwnProperty('currentId')) {
    currentId = usersContent.currentId
    console.log(usersContent)
  } else {
    const newUsersContent = JSON.stringify({
      users: usersContent.users,
      currentId: 1,
    })
    fs.writeFile(usersFile, newUsersContent, err => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
})

app.get(
  `/api/user`,
  differenceInSeconds,
  async (req: Request, res: Response) => {
    try {
      const result = await User.findAll()
      console.log(result)
      res.status(200).send(result)
    } catch (e) {}
    // const res = await User.findOne()
  }
)

app.post(`/api/user`, async (req: Request, res: Response) => {
  try {
    console.log(res)
    const result = await User.findAll()
    console.log(result)
    res.status(200).send(result)
    console.log(res)
  } catch (e) {
    console.error(e)
  }
})

app.put(
  '/api/user/:id',
  differenceInSeconds,
  async (req: Request, res: Response) => {}
)

app.post(
  '/api/user/login',
  differenceInSeconds,
  async (req: Request, res: Response) => {}
)

app.post(
  '/api/file',
  differenceInSeconds,
  async (req: Request, res: Response) => {}
)

app.get(
  '/api/file/:name',
  differenceInSeconds,
  async (req: Request, res: Response) => {}
)

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
