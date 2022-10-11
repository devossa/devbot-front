import { Button, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Textarea, Tfoot, Th, Thead, Tooltip, Tr } from '@chakra-ui/react'
import { formatDuration, intervalToDuration } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { MdDelete } from 'react-icons/md'
import Input from '../../components/form/Input'

import Layout from '../../components/Layout'
import { QUALITIES } from '../../utils/constants'
import { stringifyPrice } from '../../utils/helpers'


interface pricelistItem {
	sku: string
	name: string
	enabled: boolean
	autoprice: boolean
	min: number
	max: number
	intent: number
	buy: {
		keys: number
		metal: number
	}
	sell: {
		keys: number
		metal: number
	}
	time: number
	promoted: 0 | 1
	group: string
	note: {
		buy: string | null
		sell: string | null
	}
	isPartialPriced: boolean
}

const round = (num: number, step: number) => {
	const inv = 1.0 / step

	const rounded = Math.round(num * inv) / inv
	return rounded
}
export const toScrap = (refined: number) => {
	// Get the estimated amount of scrap
	let scrap = refined * 9
	// Round it to the nearest half
	scrap = round(scrap, 0.5)
	return scrap
}

export const calculateProfit = (
	keyPrices: { buy: number; sell: number },
	{ buy, sell }: { buy: { keys?: number; metal?: number }; sell: { keys?: number; metal?: number } }
): number => {
	const calculatedBuy = toScrap(buy.metal || 0) + toScrap(keyPrices.buy) * (buy.keys || 0)
	const calculatedSell = toScrap(sell.metal || 0) + toScrap(keyPrices.sell) * (sell.keys || 0)

	return calculatedSell - calculatedBuy
}

export default () => {
	const [items, setItems] = useState<{ [key: string]: pricelistItem } | null>(null)
	const [text, setText] = useState('')

	const submitPricelist = () => {
		window.localStorage.setItem('pricelist', text)
		setItems(JSON.parse(text))
	}
	const clearPricelist = () => {
		window.localStorage.removeItem('pricelist')
		setItems(null)
	}

	const exportPricelist = () => {
		setText(JSON.stringify(items))
		window.localStorage.removeItem('pricelist')
		setItems(null)
	}

	const removePricelistItem = (sku: string) => {
		setItems((oldState): { [key: string]: pricelistItem } => {
			const newState = { ...oldState }
			delete newState[sku]
			return newState
		})
	}

	useEffect(() => {
		setItems(JSON.parse(window.localStorage.getItem('pricelist')))
	}, [])

	return (
		<Layout title="Items List">
			{items === null ? (<Flex direction='column'>
				<Textarea value={text} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} placeholder='Paste your price list here' w='100%' rows={20}></Textarea>
				<Button onClick={submitPricelist} mt='20px'>Submit</Button>
			</Flex>) : (
				<Flex direction='column'>
					<Flex justifyContent='space-between' mb='20px'>
						<Button onClick={exportPricelist} colorScheme='teal'>Export pricelist</Button>
						<Button onClick={clearPricelist} mr='20px' colorScheme='red'>Clear pricelist</Button>
					</Flex>
					<Flex>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Name</Th>
									<Th>Buy</Th>
									<Th>Sell</Th>
									<Th>Profit</Th>
									<Th>Max</Th>
									<Th>Actions</Th>
								</Tr>
							</Thead>
							<Tbody>
								{Object.values(items).sort((a, b) => {
									return calculateProfit({ buy: 47.22, sell: 47.33 }, a) - calculateProfit({ buy: 47.22, sell: 47.33 }, b)
								}).map((item: pricelistItem, index: number) => {
									const craftable = !item.name.includes('Non-Craftable')
									let quality = 6
									if (!(item.name.includes('Strange Part') || item.name.includes('Unusual-'))) {
										for (const [id, q] of Object.entries(QUALITIES)) {
											if (item.name.includes(q)) {
												quality = Number(id)
												break
											}
										}
									}

									const duration = intervalToDuration({
										start: new Date(item.time * 1000),
										end: new Date(),
									})

									return (
										<Tr bgColor={index % 2 === 0 ? 'blue.100' : 'white'}>
											<Th>{item.name}</Th>
											<Th>{stringifyPrice(item.buy)}</Th>
											<Th>{stringifyPrice(item.sell)}</Th>
											<Tooltip label={`Updated ${formatDuration(duration)} ago`}>
												<Th>{calculateProfit({ buy: 47.22, sell: 47.33 }, item)}</Th>
											</Tooltip>
											<Th><Input value={items[item.sku].max} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												setItems((oldState) => {
													const newState = { ...oldState }
													const newItem = { ...item }
													newItem.max = Number(e.target.value) || 1
													newState[item.sku] = newItem
													return newState
												})
											}} /></Th>
											<Th><MdDelete size={20} cursor='pointer' onClick={removePricelistItem.bind(null, item.sku)} /></Th>
										</Tr>
									)
								})}
							</Tbody>
						</Table>
					</Flex>
				</Flex>
			)}
		</Layout>
	)
}
