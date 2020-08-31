import fs from 'fs'
import { UserContent } from '.'

export const returnResult = (
  err: NodeJS.ErrnoException | null,
  data: string
) => {
  if (err) throw err
  return JSON.parse(data)
}

export const getFileContent = async (fileName: string) => {
  const sss = await fs.promises.readFile(fileName, { encoding: 'utf8' })
  console.log(' promises read file ', sss)
  let result: UserContent = JSON.parse(
    await fs.promises.readFile(fileName, { encoding: 'utf8' })
  )
  return result
}

export const setFileContent = (fileName: string, content: UserContent) => {
  fs.writeFile(fileName, JSON.stringify(content), err => {
    if (err) throw err
  })
}
