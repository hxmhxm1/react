export type TNote = {
  id: string
  title: string
  content: string
  updatedAt: number
  author: TUser
  authorId: string
}

export type TUser = {
   id: string
  username: string
  password: string
  notes: TNote[]
}