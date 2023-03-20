import { verifyExistMovie } from './middlewares/verifyExistMovie'
import { MoviesController } from './controllers/MoviesController'
import { startDatabase } from './database/index'
import express from 'express'

const app = express()
app.use(express.json())

const moviesController = new MoviesController()

app.get('/movies', moviesController.handle)
app.post('/movies', verifyExistMovie, moviesController.create)
app.delete('/movies/:movieId', moviesController.delete)
app.patch('/movies/:movieId', moviesController.update)

app.listen(process.env.PORT_APPLICATION, async () => {
  startDatabase()
  console.log('App is running port ' + process.env.PORT_APPLICATION)
})
