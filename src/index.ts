import express from 'express'

import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import taskRoutes from './routes/tasks'
import profileRoutes from './routes/profile'

const app = express()
const PORT = 3333

app.use(express.json())

// Auth
// POST http://localhost:3333/api/auth/login
// POST http://localhost:3333/api/auth/register
app.use('/api/auth', authRoutes)

// Produtos
// GET http://localhost:3333/api/products
// POST http://localhost:3333/api/products
// PUT http://localhost:3333/api/products/:id
// DELETE http://localhost:3333/api/products/:id
app.use('/api/products', productRoutes)

// Tarefas
// GET http://localhost:3333/api/tasks/:product_id
// POST http://localhost:3333/api/tasks
// PUT http://localhost:3333/api/tasks/:id
// DELETE http://localhost:3333/api/tasks/:id
app.use('/api/tasks', taskRoutes)

// Perfil do usuário
// GET http://localhost:3333/api/profile
// POST http://localhost:3333/api/profile
app.use('/api/profile', profileRoutes)

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`)
})
