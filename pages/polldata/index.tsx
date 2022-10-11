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
	const [data, setData] = useState<{ [key: string]: pricelistItem } | null>(null)
	const [text, setText] = useState('')

	const submitPricelist = () => {
		const { offerData, received, sent, timestamps } = JSON.parse(text)
		window.localStorage.setItem('polldata', JSON.stringify({ offerData, received, sent, timestamps }))
		setData({ offerData, received, sent, timestamps })
	}
	const clearPricelist = () => {
		window.localStorage.removeItem('polldata')
		setData(null)
	}

	const exportPricelist = () => {
		setText(JSON.stringify(data))
		window.localStorage.removeItem('polldata')
		setData(null)
	}

	const removePricelistItem = (sku: string) => {
		setData((oldState): { [key: string]: pricelistItem } => {
			const newState = { ...oldState }
			delete newState[sku]
			return newState
		})
	}

	useEffect(() => {
		setData(JSON.parse(window.localStorage.getItem('polldata')))
	}, [])

	console.log(data)

	return (
		<Layout title="Items List">
			{data === null ? (<Flex direction='column'>
				<Textarea value={text} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} placeholder='Paste your price list here' w='100%' rows={20}></Textarea>
				<Button onClick={submitPricelist} mt='20px'>Submit</Button>
			</Flex>) : (
				<Flex direction='column'>

				</Flex>
			)}
		</Layout>
	)
}
