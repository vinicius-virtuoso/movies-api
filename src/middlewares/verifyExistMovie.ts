import { QueryConfig } from 'pg'
import { client } from './../database/index'
import { MovieCreate, MovieResult } from './../interfaces/index'
import { NextFunction, Request, Response } from 'express'

export const verifyExistMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movies: MovieCreate = req.body

  if (
    !movies.name ||
    !movies.description ||
    !movies.duration ||
    !movies.price
  ) {
    return res.status(400).json({
      message: 'Missing data required (name, description, duration, price)',
    })
  }

  const queryStringFindMovie = `
    SELECT name FROM "movies" 
    WHERE "name" = $1;
    `

  const queryConfig: QueryConfig = {
    text: queryStringFindMovie,
    values: [movies.name],
  }

  const queryFindMovieResult: MovieResult = await client.query(queryConfig)
  const movieFind = queryFindMovieResult.rows.length

  if (movieFind > 0) {
    return res.status(400).json({
      message: 'Movie already exists.',
    })
  }

  return next()
}
