import os from 'os'
import path from 'path'
import ini from 'ini'
import { existsSync, readFileSync } from 'fs'

export interface GitUser {
  name: string
  username: string
  email: string
}

let gitUser: GitUser | null = null

export const getGitUser = (mock?: boolean): GitUser => {
  if (gitUser) return gitUser

  if (mock) {
    return {
      name: 'MOCK_NAME',
      username: 'MOCK_USERNAME',
      email: 'mock@example.com',
    }
  }

  const filepath = path.join(os.homedir(), '.gitconfig')
  if (!existsSync(filepath)) {
    return { name: '', username: '', email: '' }
  }
  const { user = {} } = ini.parse(readFileSync(filepath, 'utf8'))
  gitUser = {
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
  }
  return gitUser
}
