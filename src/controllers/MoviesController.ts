import format from 'pg-format'
import { MovieCreate, MovieResult } from './../interfaces/index'
import { client } from './../database/index'
import { Request, Response } from 'express'
import { QueryConfig } from 'pg'

export class MoviesController {
  async handle(req: Request, res: Response) {
    const { page = 1, limit = 2 } = req.query
    const perPage = Number(limit)
    const pageQuery = Number(page)

    const queryString = `
      SELECT * FROM "movies" ORDER BY "name" ASC
      OFFSET $1 LIMIT $2;
    `

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [
        perPage * (pageQuery - 1) > 0 ? perPage * (pageQuery - 1) : 1,
        perPage > 0 ? perPage : 2,
      ],
    }

    const previous = `${process.env.URL_API}movies?page=${
      pageQuery - 1 <= 0 ? 1 : pageQuery - 1
    }&limit=${perPage}`
    const next = `${process.env.URL_API}movies?page=${
      pageQuery + 1 > 0 ? pageQuery + 1 : 2
    }&limit=${perPage}`

    const queryResult = await client.query(queryConfig)
    const movies = queryResult.rows

    return res
      .status(200)
      .json({ page_previous: previous, page_next: next, movies })
  }

  async create(req: Request, res: Response) {
    const movies: MovieCreate = req.body

    const queryString = format(
      `
    INSERT INTO "movies" 
      (%I)
    VALUES
      (%L) 
    RETURNING *;
  `,
      Object.keys(movies),
      Object.values(movies)
    )

    const queryResult: MovieResult = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])
  }

  async delete(req: Request, res: Response) {
    const { movieId } = req.params

    const queryString = `
      DELETE FROM "movies" WHERE id = ($1);
    `

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [movieId],
    }

    await client.query(queryConfig)

    return res.status(200).json([])
  }

  async update(req: Request, res: Response) {
    const { movieId } = req.params
    const payload = req.body

    const queryString = format(
      `
    UPDATE movies
    SET
      (%I) = ROW(%L)
    WHERE id = ${movieId} 
    RETURNING *;
  `,
      Object.keys(payload),
      Object.values(payload)
    )

    const queryResult: MovieResult = await client.query(queryString)

    return res.status(200).json(queryResult.rows[0])
  }
}
