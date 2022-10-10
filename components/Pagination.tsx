import * as React from 'react'

import { Box, Flex, FlexProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface PaginationProps extends FlexProps {
	previous?: boolean
	next?: boolean
	total?: number
	current?: number
	goToPage?: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
	previous,
	next,
	total,
	current = 1,
	goToPage,
	...rest
}: PaginationProps): React.ReactElement => {
	const { query, push } = useRouter()
	const pages = []

	goToPage =
		goToPage ||
		((page: number): void => {
			push({
				query: { ...query, page: page },
			})
		})
	if (total && total > 1) {
		for (
			let i = Math.max(1, current - 2);
			i <= Math.min(total, current + 2);
			i++
		) {
			pages.push(
				<Box
					as="button"
					bg={i == current ? 'brand.700' : ''}
					key={i}
					minWidth="32px"
					px="12px"
					h="100%"
					fontWeight="500"
					color={i == current ? 'white' : 'gray.500'}
					fontSize="xs"
					justifyContent="center"
					alignItems="center"
					_hover={{ color: 'white', background: 'brand.700' }}
					onClick={(): void => goToPage(i)}
				>
					{i}
				</Box>,
			)
		}
	} else {
		pages.push(
			<Flex
				as="button"
				key={1}
				bg="brand.700"
				minWidth="32px"
				px="12px"
				h="100%"
				fontWeight="500"
				color="white"
				fontSize="xs"
				justifyContent="center"
				alignItems="center"
			>
				{current}
			</Flex>,
		)
	}
	return (
		<Flex
			bg="white"
			minH="32px"
			h="32px"
			borderRadius="5px"
			boxShadow="md"
			alignSelf="flex-end"
			{...rest}
		>
			<Flex
				as="button"
				minWidth="32px"
				px="12px"
				h="100%"
				fontWeight="500"
				color="gray.500"
				fontSize="xs"
				disabled={!previous}
				_disabled={{ color: 'gray.300' }}
				justifyContent="center"
				alignItems="center"
				borderLeftRadius="4px"
				_hover={!previous ? {} : { color: 'white', background: 'brand.700' }}
				onClick={(): void => goToPage(current - 1)}
			>
				Précédent
			</Flex>
			{pages}
			<Flex
				as="button"
				minWidth="32px"
				px="12px"
				h="100%"
				fontWeight="500"
				color="gray.500"
				fontSize="xs"
				disabled={!next}
				_disabled={{ color: 'gray.300' }}
				justifyContent="center"
				alignItems="center"
				borderRightRadius="4px"
				_hover={!next ? {} : { color: 'white', background: 'brand.700' }}
				onClick={(): void => goToPage(current + 1)}
			>
				Suivant
			</Flex>
		</Flex>
	)
}

export default Pagination
