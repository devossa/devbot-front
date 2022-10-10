import React, { useEffect, useState } from 'react'
import {
	Flex,
	Text,
	Input,
	Select,
	InputGroup,
	InputLeftAddon,
	Skeleton,
	Spinner,
} from '@chakra-ui/react'
import Layout from '../../components/Layout'
import { ItemProps } from '../../utils/db'
import { QUALITIES } from '../../utils/constants'
import ItemCard from '../../components/ItemCard'
import { useRouter } from 'next/router'
import { UrlObject } from 'url'
import { BiSortDown, BiSortUp } from 'react-icons/bi'
import Pagination from '../../components/Pagination'
import useSWR from 'swr'

export default () => {
	const [search, setSearch] = useState('')
	const { query, push, pathname } = useRouter() as {
		query: { [key: string]: string }
		push: (url: UrlObject) => Promise<boolean>
		pathname: string
	}
	const [quality, setQuality] = useState('all')
	const [sort, setSort] = useState({ by: 'created_at', asc: true })

	const { data, isValidating, error } = useSWR(
		`/items?${`sort=${!sort.asc ? sort.by : `-${sort.by}`}`}&${
			search !== '' ? `search=${search}&` : ''
		}${quality !== 'all' ? `quality=${quality}&` : ''}${
			!isNaN(Number(query.page)) ? `page=${query.page}&` : ''
		}`,
	)
	const items = data?.data as ItemProps[]

	useEffect(() => {
		console.log(query)

		if (query.hasOwnProperty('quality')) setQuality(query.quality)
		if (query.hasOwnProperty('search')) setSearch(query.search)
		if (query.hasOwnProperty('sort'))
			setSort({
				by: (query.sort as string).replace('-', ''),
				asc: !(query.sort as string).startsWith('-'),
			})
	}, [query])

	return (
		<Layout title="Items List">
			{error ? (
				<Text>{error}</Text>
			) : (
				<>
					<Flex my="20px">
						<Input
							placeholder="Search by name or sku"
							value={search}
							onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
								push({
									pathname,
									query: {
										...query,
										search: e.target.value,
										page: 1,
									},
								})
								setSearch(e.target.value)
							}}
							mr="10px"
						/>
						<Select
							value={quality}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
								const newQuery = { ...query }
								if (e.target.value === 'all') {
									delete newQuery.quality
								} else {
									newQuery.quality = e.target.value
								}
								push({
									pathname,
									query: newQuery,
								})
								setQuality(e.target.value)
							}}
							mr="10px"
						>
							<option value="all">All</option>
							{Object.entries(QUALITIES).map((itm) => {
								return (
									<option key={itm[0]} value={itm[0]}>
										{itm[1]}
									</option>
								)
							})}
						</Select>
						<InputGroup>
							<InputLeftAddon
								onClick={() => {
									setSort((old_state) => {
										console.log(
											old_state.asc
												? old_state.by.replace('-', '')
												: `-${old_state.by}`,
										)

										push({
											pathname,
											query: {
												...query,
												sort: old_state.asc
													? old_state.by.replace('-', '')
													: `-${old_state.by}`,
											},
										})
										return {
											...old_state,
											asc: !old_state.asc,
										}
									})
								}}
							>
								{sort.asc ? <BiSortDown /> : <BiSortUp />}
							</InputLeftAddon>
							<Select
								value={sort.by}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
									setSort((old_state) => {
										push({
											pathname,
											query: {
												...query,
												sort: !old_state.asc
													? e.target.value
													: `-${e.target.value}`,
											},
										})
										return {
											...old_state,
											by: e.target.value,
										}
									})
								}}
							>
								<option value="buy">Buy Price</option>
								<option value="sell">Sell Price</option>
								<option value="profit">Profit Margin</option>
								<option value="updated_at">Updated</option>
								<option value="created_at">Created</option>
							</Select>
						</InputGroup>
					</Flex>
					<Flex flexWrap="wrap" justifyContent="space-between">
						{items === undefined ? (
							<>
								{new Array(10).fill(0).map((_, i) => (
									<Skeleton
										key={i}
										w="19%"
										minH="200px"
										borderRadius="7px"
										mb="20px"
										overflow="hidden"
									/>
								))}
								<Skeleton
									ml="auto"
									w="300px"
									h="32px"
									borderRadius="7px"
									mb="20px"
									overflow="hidden"
								/>
							</>
						) : (
							<>
								{isValidating && (
									<Flex
										position="fixed"
										top={0}
										left={0}
										bgColor="rgba(0,0,0,.2)"
										w="100vw"
										h="100vh"
										justifyContent="center"
										alignItems="center"
									>
										<Spinner
											thickness="4px"
											speed="0.65s"
											emptyColor="gray.200"
											color="blue.500"
											size="xl"
										/>
									</Flex>
								)}
								{items?.map((itm) => (
									<ItemCard
										key={itm.id}
										item={itm}
										showDate={['updated_at', 'profit'].includes(sort.by)}
									/>
								))}
								<Pagination
									total={data?.total}
									current={Number(query.page) || 1}
									next={Number(query.page) !== data?.total}
									previous={Number(query.page) !== 1}
									ml="auto"
								/>
							</>
						)}
					</Flex>
				</>
			)}
		</Layout>
	)
}
