import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export function signToken(payload: object): string {
	return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, env.JWT_SECRET)
	} catch {
		return null
	}
}
