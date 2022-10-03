import { GetStaticProps } from 'next'

import prisma, { ItemProps } from '../../utils/db'
import Layout from '../../components/Layout'
import ListDetail from '../../components/ListDetail'

type Props = {
  item?: ItemProps
  errors?: string
}

const StaticPropsDetail = ({ item, errors }: Props) => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${item ? item.name : 'User Detail'
        } | Next.js + TypeScript Example`}
    >
      {/* {item && <ListDetail item={item} />} */}
    </Layout>
  )
}

export default StaticPropsDetail

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const sku = params?.sku as string

    const item = await prisma.items.findFirst({ where: { sku: sku } })

    return { props: { item } }
  } catch (err: any) {
    return { props: { errors: err.message } }
  }
}
