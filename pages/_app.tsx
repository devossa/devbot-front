import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { SWRConfig } from 'swr'

const colors = {
	brand: {
		900: '#1a365d',
		800: '#153e75',
		700: '#2a69ac',
	},
	qualities: {
		0: '#B2B2B2',
		1: '#4D7455',
		3: '#476291',
		5: '#8650AC',
		6: '#FFD700',
		7: '#70B04A',
		8: '#A50F79',
		9: '#70B04A',
		11: '#CF6A32',
		13: '#38F3AB',
		14: '#AA0000',
	},
}

const theme = extendTheme({ colors })
const baseUrl = '/api'
const fetcher = async (
	input: RequestInfo,
	init?: RequestInit,
): Promise<any> => {
	init = {
		...init,
		headers: {
			...((init || {}).headers || {}),
		},
	}
	const res = await fetch(`${baseUrl}${input}`, init)

	return res.json()
}

export default function App({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<SWRConfig value={{ refreshInterval: 30 * 1000, fetcher }}>
				<Component {...pageProps} />
			</SWRConfig>
		</ChakraProvider>
	)
}
