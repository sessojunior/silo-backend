// Autenticação

import { Router, Request, Response } from 'express'
import { db } from '../config/db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { signToken } from '../utils/jwt'
import { validateEmail, validatePassword, validateName } from '../utils/validate'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body
	const errors: { name: string; error: string }[] = []

	if (!email) errors.push({ name: 'email', error: 'E-mail é obrigatório.' })
	if (!password) errors.push({ name: 'password', error: 'Senha é obrigatória.' })

	if (email && !validateEmail(email)) {
		errors.push({ name: 'email', error: 'E-mail inválido.' })
	}
	if (password && !validatePassword(password)) {
		errors.push({
			name: 'password',
			error: 'A senha deve conter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.',
		})
	}

	if (errors.length > 0) {
		res.status(400).json({ error: 'Dados inválidos.', fields: errors })
		return
	}

	const result = await db.select().from(users).where(eq(users.email, email))
	const user = result[0]

	if (!user) {
		res.status(404).json({ error: 'Usuário não encontrado.' })
		return
	}

	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		res.status(401).json({ error: 'Senha inválida.' })
		return
	}

	const token = signToken({ id: user.id, email: user.email })
	res.status(200).json({ token })
	return
})

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
	const { name, email, password } = req.body
	const errors: { name: string; error: string }[] = []

	if (!name) errors.push({ name: 'name', error: 'Nome é obrigatório.' })
	if (!email) errors.push({ name: 'email', error: 'E-mail é obrigatório.' })
	if (!password) errors.push({ name: 'password', error: 'Senha é obrigatória.' })

	if (name && !validateName(name)) {
		errors.push({ name: 'name', error: 'Nome inválido.' })
	}
	if (email && !validateEmail(email)) {
		errors.push({ name: 'email', error: 'E-mail inválido.' })
	}
	if (password && !validatePassword(password)) {
		errors.push({
			name: 'password',
			error: 'A senha deve conter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.',
		})
	}

	if (errors.length > 0) {
		res.status(400).json({ error: 'Dados inválidos.', fields: errors })
		return
	}

	const existing = await db.select().from(users).where(eq(users.email, email))
	if (existing.length > 0) {
		res.status(409).json({ error: 'E-mail já cadastrado.' })
		return
	}

	const hashed = await bcrypt.hash(password, 10)
	const id = randomUUID()

	await db.insert(users).values({
		id,
		name: name.trim(),
		email: email.trim().toLowerCase(),
		password: hashed,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	})

	const token = signToken({ id, email })
	res.status(201).json({ token })
	return
})

export default router
