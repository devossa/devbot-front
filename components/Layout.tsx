import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import { Flex } from "@chakra-ui/react";
import Footer from "./Footer";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <Flex direction="column">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <Flex direction="column">
      <Flex p="20px" w="95%" direction="column" maxW="1200px" mx="auto">
        {children}
      </Flex>
      {/* <Footer /> */}
    </Flex>
  </Flex>
);

export default Layout;
