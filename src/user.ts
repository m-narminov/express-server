import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { usersFile, UserContent } from './index'
import { getFileContent, setFileContent, emailPassword } from './utils'

export class User {
  id: number
  name: string
  email: string
  password: string
  enabled: boolean

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    enabled: boolean
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = crypto.createHash('md5').update(password).digest('hex')
    this.enabled = enabled
  }

  static async add(user: User) {
    const { name, email, password, enabled } = user
    const usersContent: UserContent = await getFileContent(usersFile)

    console.log('Add current users.json content', usersContent)

    const newCurrentId = usersContent.currentId + 1
    const newUser = new User(newCurrentId, user.name, email, password, enabled)
    const newContent: UserContent = {
      users: [...usersContent.users, newUser],
      currentId: newCurrentId,
    }
    setFileContent(usersFile, newContent)
  }

  static async findById(id: number) {
    const usersContent: UserContent = await getFileContent(usersFile)
    console.log(usersContent)
    const foundUser = usersContent.users.find(
      (usr: { id: number }) => usr.id === id
    )
    return foundUser
  }

  static async findAll() {
    const usersContent: UserContent = await getFileContent(usersFile)
    console.log('find all static ', usersContent)
    const users = usersContent.users
    return users
  }

  static async update(user: User) {
    const usersContent = await getFileContent(usersFile)
  }

  static async login(emailPassword: emailPassword) {
    const { email, password } = emailPassword

    const passwordHash = crypto.createHash('md5').update(password).digest('hex')
    const usersContent: UserContent = await getFileContent(usersFile)
    console.log('User.login   ====== ', usersContent)

    const token: string = jwt.sign({ foo: 'bar' }, 'shhhhhh')
    console.log('login token =================== ', token)
    // const foundUser = usersContent.users.find(
    //   (usr: { id: number }) => usr.id === id
    // )
    // return foundUser
  }
}
