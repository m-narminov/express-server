import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import {
  getFileContent,
  setFileContent,
  emailPassword,
  UserContent,
  UserForFindOne,
  usersFile,
} from './utils'

export class User {
  id: number
  name: string
  email: string
  password: string
  enabled: boolean
  token: string

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
    this.token = ''
  }

  static async add(user: User) {
    const { name, email, password, enabled } = user
    const usersContent: UserContent = await getFileContent(usersFile)

    console.log('Add current users.json content', usersContent)

    const newCurrentId = usersContent.currentId + 1
    const newUser = new User(newCurrentId, name, email, password, enabled)
    const newContent: UserContent = {
      users: [...usersContent.users, newUser],
      currentId: newCurrentId,
    }
    setFileContent(usersFile, newContent)
  }

  static async findById(id: number) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const foundUser = usersContent.users.find(
      (usr: { id: number }) => usr.id === id
    )
    return foundUser
  }

  static async findByToken(userToken: string) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    const foundUser = users.find(({ token }: User) => token === userToken)
    if (!foundUser) throw new Error('User not found')
    return foundUser
  }

  static async findAll() {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    return users
  }

  static async update(user: User) {
    const updatedUser = user
    const usersContent = await getFileContent(usersFile)
    const currentUsers = usersContent.users
    const newUsers = currentUsers.filter(user => user.id !== updatedUser.id)
    const newUsersContent = {
      ...usersContent,
      users: [...newUsers, updatedUser],
    }

    setFileContent(usersFile, newUsersContent)
  }

  static async login(emailPassword: emailPassword) {
    const { email, password } = emailPassword

    const passwordHash = crypto.createHash('md5').update(password).digest('hex')
    const usersContent: UserContent = await getFileContent(usersFile)

    const foundUser = usersContent.users.find(
      (usr: { email: string; password: string }) =>
        usr.email === email && usr.password === passwordHash
    )
    if (!foundUser) throw new Error('User not found')

    const token: string = jwt.sign({ email, passwordHash }, passwordHash, {
      expiresIn: '4h',
    })

    await this.update({ ...foundUser, token })

    return token
  }
}
