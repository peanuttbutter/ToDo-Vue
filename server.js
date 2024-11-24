import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import cors from 'cors'
import { nanoid } from 'nanoid'
import { Low, JSONFile } from 'lowdb'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

app.use(cors())
app.use(bodyParser.json())

const file = path.join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

const startServer = async () => {
  await db.read()
  db.data ||= { tasks: [] }
  await db.write()

  app.get('/tasks', async (req, res) => {
    await db.read()
    res.json(db.data.tasks)
  })

  app.get('/tasks/:id', async (req, res) => {
    await db.read()
    const task = db.data.tasks.find((t) => t.id === req.params.id)
    if (task) {
      res.json(task)
    } else {
      res.status(404).send('Задача не найдена')
    }
  })

  app.post('/tasks', async (req, res) => {
    const newTask = {
      id: nanoid(4),
      status: 'todo',
      ...req.body,
    }
    db.data.tasks.push(newTask)
    await db.write()
    res.json(newTask)

    io.emit('taskAdded', newTask)
  })

  app.put('/tasks/:id', async (req, res) => {
    const taskIndex = db.data.tasks.findIndex((t) => t.id === req.params.id)
    if (taskIndex !== -1) {
      db.data.tasks[taskIndex] = {
        ...db.data.tasks[taskIndex],
        ...req.body,
      }
      await db.write()
      res.json(db.data.tasks[taskIndex])

      io.emit('taskUpdated', db.data.tasks[taskIndex])
    } else {
      res.status(404).send('Задача не найдена')
    }
  })

  app.delete('/tasks/:id', async (req, res) => {
    const taskIndex = db.data.tasks.findIndex((t) => t.id === req.params.id)
    if (taskIndex !== -1) {
      const deletedTask = db.data.tasks.splice(taskIndex, 1)[0]
      await db.write()
      res.json({ message: 'Задача удалена' })

      io.emit('taskDeleted', deletedTask.id)
    } else {
      res.status(404).send('Задача не найдена')
    }
  })

  io.on('connection', (socket) => {
    console.log('Новое соединение:', socket.id)

    socket.on('disconnect', () => {
      console.log('Пользователь отключился:', socket.id)
    })
  })

  const PORT = 3000
  server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
  })
}

startServer()
