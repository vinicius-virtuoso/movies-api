import { QueryResult } from 'pg'

export interface Movie {
  id: number
  name: string
  description: string
  duration: number
  price: number
}

export type MovieCreate = Omit<Movie, 'id'>
export type MovieResult = QueryResult<Movie>
