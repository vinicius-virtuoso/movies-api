import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send('Hello World')
})

const port = 3333

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
