import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  qualities: {
    0: "#B2B2B2",
    1: "#4D7455",
    3: "#476291",
    5: "#8650AC",
    6: "#FFD700",
    7: "#70B04A",
    8: "#A50F79",
    9: "#70B04A",
    11: "#CF6A32",
    13: "#38F3AB",
    14: "#AA0000",
  }

}


const theme = extendTheme({ colors })

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}