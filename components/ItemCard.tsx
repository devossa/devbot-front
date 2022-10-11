import { Flex, Text, Image, useToast, Box } from '@chakra-ui/react'
import { useCallback } from 'react'
import { stringifyPrice } from '../utils/helpers'
import { QUALITIES } from '../utils/constants'
import { ItemProps } from '../utils/db'
import { formatDuration, intervalToDuration } from 'date-fns'

interface ItemCardProps {
	item: ItemProps
	showDate?: boolean
}

export const strippedName = (item: ItemProps): string => {
	return item.name
		.replace('Non-Craftable', '')
		.replace('The', '')
		.replace(QUALITIES[item.quality], '')
		.trim()
}

export default ({ item, showDate = false }: ItemCardProps) => {
	const toast = useToast()

	const copyName = useCallback((name: string) => {
		const textArea = document.createElement('textarea')
		// textArea.value = `!add item=${name}`
		textArea.value = `item=${name}\n`
		document.body.appendChild(textArea)
		textArea.select()
		try {
			document.execCommand('copy')
			toast({
				position: 'top',
				description: `${name} copied to clipboard`,
				status: 'success',
				duration: 1000,
				isClosable: true,
			})
		} catch (err) {
			toast({
				position: 'top',
				description: `error while copying to clipboard`,
				status: 'error',
				duration: 1000,
				isClosable: true,
			})
			console.error('Unable to copy to clipboard', err)
		}
		document.body.removeChild(textArea)
	}, [])

	const duration = intervalToDuration({
		start: new Date(item.updated_at),
		end: new Date(),
	})

	return (
		<Flex
			w="19%"
			minH="200px"
			borderRadius="7px"
			mb="20px"
			direction="column"
			border={item.craftable === 1 ? null : '2px dashed'}
			bgColor={`qualities.${item.quality}`}
			overflow="hidden"
		>
			<Flex justifyContent="flex-end" p="5px 5px 0 5px">
				{showDate && (
					<Text noOfLines={1} flex={1}>
						{formatDuration(duration)}
					</Text>
				)}
				<a
					target="_blank"
					href={`https://backpack.tf/stats/${QUALITIES[item.quality]
						}/${strippedName(item)}/Tradable/${item.craftable === 1 ? 'Craftable' : 'Non-Craftable'
						}`}
				>
					<Image src="icons/bptf.png" h="20px" />
				</a>
			</Flex>
			<Image src={item.image_url_large} />
			<Flex
				direction="column"
				bgColor="rgba(255, 255, 255, .4)"
				flex={1}
				px="10px"
			>
				<Text
					textAlign="center"
					fontSize="sm"
					fontWeight="bold"
					onClick={copyName.bind(null, item.name)}
				>
					{item.name}
				</Text>
				<Text fontSize="sm" mt="auto" fontWeight="bold">
					{`Buy: ${stringifyPrice(item.price.buy)}`}
				</Text>
				<Text fontSize="sm" fontWeight="bold">
					{`Sell: ${stringifyPrice(item.price.sell)}`}
				</Text>
			</Flex>
		</Flex>
	)
}
