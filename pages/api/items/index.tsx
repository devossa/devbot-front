import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const perPage = 20
		const args = {
			take: perPage,
			where: {},
			skip: 0,
		}

		if (req.query.hasOwnProperty('page')) {
			args.skip = perPage * (Number(req.query.page) - 1) || 0
		}
		if (req.query.hasOwnProperty('sort')) {
			let order
			switch ((req.query.sort as string).replace('-', '')) {
				case 'buy':
					order = [
						{
							price: {
								buy: {
									keys: req.query.sort.includes('-') ? 'desc' : 'asc',
								},
							},
						},
						{
							price: {
								buy: {
									metal: req.query.sort.includes('-') ? 'desc' : 'asc',
								},
							},
						},
					]
					break
				case 'sell':
					order = [
						{
							price: {
								sell: {
									keys: req.query.sort.includes('-') ? 'desc' : 'asc',
								},
							},
						},
						{
							price: {
								sell: {
									metal: req.query.sort.includes('-') ? 'desc' : 'asc',
								},
							},
						},
					]
					break
				default:
					order = {
						[(req.query.sort as string).replace('-', '')]:
							req.query.sort.includes('-') ? 'desc' : 'asc',
					}
					break
			}
			args['orderBy'] = order
		}

		if (req.query.hasOwnProperty('quality')) {
			args.where['quality'] = Number(req.query.quality)
		}

		if (req.query.hasOwnProperty('search')) {
			args.where['name'] = {
				contains: req.query.search as string,
				mode: 'insensitive',
			}
		}

		// BIG ISSUE: it doesn't wanna apply any kind of filters on relations !!!!
		const [count, itemsResponse] = await prisma.$transaction([
			prisma.items.count({ ...args, take: undefined, skip: 0 }),
			prisma.items.findMany(args),
		])

		const items = itemsResponse.map((itm) => ({
			...itm,
			created_at: itm.created_at.valueOf(),
			updated_at: itm.updated_at.valueOf(),
		}))
		return res
			.status(200)
			.json({ data: items, count, total: Math.ceil(count / perPage) })
	} catch (err: any) {
		console.log(err)

		res.status(500).json({ message: err.message })
	}
}
