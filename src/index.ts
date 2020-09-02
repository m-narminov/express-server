import express, { Request, Response } from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'

import { UserContent, usersFile } from './utils'
import { differenceInSeconds, checkAuth } from './middlewares'
import { User } from './user'

export let currentId: number = 0
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

app.use(bodyParser.json())

app.get(
  `/api/user`,
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const result = await User.findAll()
      res.status(200).send(result)
    } catch (e) {
      res.status(500)
    }
  }
)

app.post(
  `/api/user`,
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const result = await User.add(req.body)
      res.status(200).send(result)
    } catch (e) {
      console.error(e)
      res.status(500)
    }
  }
)

app.put(
  '/api/user/:id',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      await User.update(req.body)
      res.status(200)
    } catch (e) {
      res.status(500)
    }
  }
)

app.post(
  '/api/user/login',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const loginRes = await User.login({ email, password })
      res.status(200).send(loginRes)
    } catch (e) {
      console.error(e)
      res.status(401)
    }
  }
)

app.post(
  '/api/file',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      res.status(200)
    } catch (e) {
      res.status(500)
    }
  }
)

app.get(
  '/api/file/:name',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      res.status(200)
    } catch (e) {
      res.status(500)
    }
  }
)

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
