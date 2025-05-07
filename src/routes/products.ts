// Produtos

import { Response, Router } from 'express'
import { db } from '../config/db'
import { products } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { randomUUID } from 'crypto'

const router = Router()

// Listar produtos do usuário logado
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const list = await db.select().from(products).where(eq(products.user_id, req.user!.id))
	res.json(list)
	return
})

// Criar produto
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { name } = req.body
	if (!name || name.trim().length === 0) {
		res.status(400).json({ error: 'Nome é obrigatório.' })
		return
	}

	const newProduct = {
		id: randomUUID(),
		user_id: req.user!.id,
		name: name.trim(),
	}

	await db.insert(products).values(newProduct)
	res.status(201).json(newProduct)
	return
})

// Alterar produto
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { id } = req.params
	const { name } = req.body
	if (!name) {
		res.status(400).json({ error: 'Nome é obrigatório.' })
		return
	}

	const result = await db.update(products).set({ name: name.trim() }).where(eq(products.id, id))

	res.json({ updated: result })
	return
})

// Deletar produto
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { id } = req.params
	await db.delete(products).where(eq(products.id, id))
	res.status(204).send()
	return
})

export default router
