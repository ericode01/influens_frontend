import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Generators/ScriptGenerators/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
import RecentGenerators from 'src/content/Generators/ScriptGenerators/RecentGenerators';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"

// This gets called on every request
export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  // Fetch data from external API
  const url = process.env.PROD == "true" ? process.env.PROD_INFLUENS_BACKEND + "get_script_generators/"+session.user.user_id : process.env.LOCAL_HOST + "get_script_generators/"+session.user.user_id;
  const res = await fetch(url)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data, session } }
}

function ScriptGenerators({ data, session }) {
  const scriptGenerators = data["script_generators"]

  return (
    <>
      <Head>
        <title>Script generators</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentGenerators scriptGenerators={scriptGenerators}  />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ScriptGenerators.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ScriptGenerators;
