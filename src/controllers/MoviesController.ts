import format from 'pg-format'
import { MovieCreate, MovieResult } from './../interfaces/index'
import { client } from './../database/index'
import { Request, Response } from 'express'
import { QueryConfig } from 'pg'

export class MoviesController {
  async handle(req: Request, res: Response) {
    const { page = 1, limit = 2, sort, order } = req.query
    const perPage = Number(limit)
    const pageOffset = Number(page)

    const queryString = `
      SELECT * FROM "movies" 
      ${sort && order && `ORDER BY ${sort} ${order}`}
      OFFSET $1 LIMIT $2;
    `

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [
        perPage * (pageOffset - 1) > 0 ? perPage * (pageOffset - 1) : 1,
        perPage > 0 ? perPage : 2,
      ],
    }

    const queryResult = await client.query(queryConfig)
    const movies = queryResult.rows

    const queryString2 = `
      SELECT COUNT(*) FROM "movies";
    `

    const queryResult2 = await client.query(queryString2)
    const moviesCount = queryResult2.rows[0].count

    const nextPageCount = moviesCount / perPage

    const previous =
      pageOffset - 1 < 1
        ? null
        : `${process.env.URL_API}movies?page=${
            pageOffset - 1 > nextPageCount ? nextPageCount : pageOffset - 1
          }&limit=${perPage}`

    const next =
      pageOffset < nextPageCount
        ? `${process.env.URL_API}movies?page=${pageOffset + 1}&limit=${perPage}`
        : null

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

    const result = await client.query(queryConfig)

    if (result.rowCount <= 0) {
      return res.status(404).json({ message: 'Movie not found.' })
    }

    return res.status(204).json([])
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
