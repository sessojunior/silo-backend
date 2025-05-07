// backend/routes/profile.ts
import { Response, Router } from 'express'
import { db } from '../config/db'
import { users_profile } from '../db/schema'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const router = Router()

// Obter perfil
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const result = await db.select().from(users_profile).where(eq(users_profile.user_id, req.user!.id))

	res.json(result[0] || null)
	return
})

// Alterar ou criar perfil
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
	const { roles, genre, google_id } = req.body

	const exists = await db.select().from(users_profile).where(eq(users_profile.user_id, req.user!.id))

	if (exists.length > 0) {
		await db.update(users_profile).set({ roles, genre, google_id }).where(eq(users_profile.user_id, req.user!.id))

		res.json({ updated: true })
	} else {
		await db.insert(users_profile).values({
			id: randomUUID(),
			user_id: req.user!.id,
			roles,
			genre,
			google_id,
		})

		res.status(201).json({ created: true })
		return
	}
})

export default router
