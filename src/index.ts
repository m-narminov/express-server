import fs from 'fs'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import httpContext from 'express-http-context'

import { UserContent, usersFile, filesPath } from './utils'
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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(httpContext.middleware)

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
      const newUser: User = req.body
      const result = await User.add(newUser)
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
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const userToken = await User.login({ email, password })
      res.status(200).send(userToken)
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
      console.log('post /api/file = ', req)
      let { fileName }: { fileName: string } = req.body
      if (!fileName || fileName.trim() === '') {
        fileName = `${new Date()}`
      }
      const writeStream = fs.createWriteStream(`${filesPath}${fileName}`, {
        encoding: 'utf-8',
      })
      req.pipe(writeStream)
      req.on('end', () => {
        res.status(200).send(`File ${fileName} uploaded`).end()
      })
    } catch (e) {
      res.status(500).send(e).end()
    }
  }
)

app.get(
  '/api/file/:name',
  differenceInSeconds,
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      if (name.trim() === '') {
        res.status(404).end()
        return
      }

      const fileStream = fs.createReadStream(filesPath + name, {
        encoding: 'utf-8',
      })

      fileStream.pipe(res)
      res.status(200)
    } catch (e) {
      res.status(500)
    }
  }
)

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
