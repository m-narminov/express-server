import fs from 'fs'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import httpContext from 'express-http-context'
import formidable from 'formidable'

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
      const form = new formidable.IncomingForm()

      form.parse(req, (err, fields, files): void => {
        if (err) {
          console.error(err)
          res.status(500).send(err).end()
          return
        }

        let fileName = files.file.name
        const uploadFilePath = files.file.path
        const uploadFileName = files.file.name
        const base64FileName = Buffer.from(uploadFileName, 'utf-8').toString(
          'base64'
        )
        if (!fileName || fileName.trim() === '') {
          fileName = `${new Date()}`
        }
        const rawData = fs.readFileSync(uploadFilePath)
        fs.writeFile(`${filesPath}${base64FileName}`, rawData, err => {
          if (err) {
            res.status(500).send('upload error').end()
            return
          }

          res.status(200).send(`File ${fileName} uploaded`).end()
        })
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
      const base64FileName = Buffer.from(name, 'utf-8').toString('base64')
      res.download(`${filesPath}${base64FileName}`, err => {
        if (err) {
          res.status(500).send('Err while download file').end()
          return
        }
      })
      // res.end()
    } catch (e) {
      res.status(500)
    }
  }
)

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
