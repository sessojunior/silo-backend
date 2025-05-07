// Utilize o comando: 'npx drizzle-kit push' para aplicar as alterações no banco de dados

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Tabela de usuários
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	created_at: text('created_at').default(''),
	updated_at: text('updated_at').default(''),
})

// Perfil do usuário
export const users_profile = sqliteTable('users_profile', {
	id: text('id').primaryKey(),
	user_id: text('user_id').notNull(),
	roles: text('roles'),
	genre: text('genre'),
	google_id: text('google_id'),
})

// Produtos
export const products = sqliteTable('products', {
	id: text('id').primaryKey(),
	user_id: text('user_id').notNull(),
	name: text('name').notNull(),
})

// Tarefas
export const tasks = sqliteTable('tasks', {
	id: text('id').primaryKey(),
	product_id: text('product_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
})
