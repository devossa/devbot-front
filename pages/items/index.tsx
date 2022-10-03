import { Flex, Text, Image, Box } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Layout from '../../components/Layout'
import prisma, { ItemProps } from '../../utils/db'

type Props = {
  items: ItemProps[]
}

export default ({ items }: Props) => (
  <Layout title="Items List">
    <Flex flexWrap='wrap' justifyContent='space-between'>
      {items.map((itm) => (
        <Flex w='19%' minH='200px' borderRadius='7px' bgColor='lightgreen' mb='20px' direction='column'>
          <Box w='100%' borderTopRadius='7px' border={!itm.craftable ? null : '2px dashed'} bgColor={`qualities.${itm.quality}`}>
            <Image src={itm.image_url_large} />
          </Box>
          <Text>{itm.name}</Text>
        </Flex>
      ))}
    </Flex>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const itemsResponse: ItemProps[] = await prisma.items.findMany({ take: 20 })
    const items = itemsResponse.map((itm) => ({
      ...itm,
      created_at: itm.created_at.toJSON(),
      updated_at: itm.updated_at.toJSON()
    }))
    await prisma.$disconnect()
    return { props: { items } }
  } catch (err: any) {
    return { props: { errors: err.message } }
  }
}