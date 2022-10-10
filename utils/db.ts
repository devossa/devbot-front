import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient()
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient()
	}

	prisma = global.prisma
}

export default prisma

export interface ItemProps {
	id: string
	sku: string
	name: string
	quality: number
	defindex: number
	craftable: number
	australium: number
	festive: Boolean
	killstreak_tier: number
	image_url: string
	image_url_large: string
	price: {
		buy: { keys: number; metal: number }
		sell: { keys: number; metal: number }
	}
	created_at: any
	updated_at: any
}
