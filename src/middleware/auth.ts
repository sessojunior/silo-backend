import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
	user?: { id: string; email: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		res.status(401).json({ error: 'Token não fornecido.' })
		return
	}

	const token = authHeader.split(' ')[1]
	try {
		const decoded = verifyToken(token)
		;(req as any).user = decoded
		next()
	} catch (err) {
		res.status(401).json({ error: 'Token inválido ou expirado.' })
	}
}
