import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {}

export default ({ ...rest }: InputProps) => {
	return <Input {...rest} />
}
