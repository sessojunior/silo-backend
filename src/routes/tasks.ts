// Tarefas

import { Response, Router } from 'express'
import { db } from '../config/db'
import { tasks } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { randomUUID } from 'crypto'

const router = Router()

// Listar tarefas de um produto
router.get('/:product_id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { product_id } = req.params
	const list = await db.select().from(tasks).where(eq(tasks.product_id, product_id))
	res.json(list)
	return
})

// Criar tarefa
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { product_id, name, description } = req.body
	if (!product_id || !name) {
		res.status(400).json({ error: 'Produto é obrigatório.' })
		return
	}

	if (!product_id || !name) {
		res.status(400).json({ error: 'Nome é obrigatório.' })
		return
	}

	const task = {
		id: randomUUID(),
		product_id,
		name: name.trim(),
		description: description?.trim() || null,
	}

	await db.insert(tasks).values(task)
	res.status(201).json(task)
	return
})

// Alterar tarefa
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { id } = req.params
	const { name, description } = req.body

	const result = await db.update(tasks).set({ name: name.trim(), description: description?.trim() }).where(eq(tasks.id, id))

	res.json({ updated: result })
	return
})

// Deletar tarefa
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { id } = req.params
	await db.delete(tasks).where(eq(tasks.id, id))
	res.status(204).send()
	return
})

export default router
