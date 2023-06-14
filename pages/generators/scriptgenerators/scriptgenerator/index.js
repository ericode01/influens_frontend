import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Generators/ScriptGenerator/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
import RecentGenerators from 'src/content/Generators/ScriptGenerators/RecentGenerators';
import RecentScripts from 'src/content/Generators/ScriptGenerator/RecentScripts';
import { useRouter } from 'next/router';

function ScriptGenerator({ data, script_generator_name }) {
  const recentScripts = data["recent_scripts"];
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Recent srcipts</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader scriptgeneratorid={router.query.scriptgeneratorid} script_generator_name={script_generator_name} />
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
            <RecentScripts recentScripts={recentScripts} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

/* export async function getStaticPaths() {
  // Fetch data from external API
  const res = await fetch("http://127.0.0.1:5000/get_all_script_generator_id/1");
  const data = await res.json();

  const paths = data.map(e => ({
      params: {
          scriptgeneratorid: e.script_generator_id.toString()
      }
  }));

  return {
    paths,
    fallback: false,
  };
} */

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
  const url1 = process.env.PROD == "true" ? process.env.PROD_INFLUENS_BACKEND + "get_recent_scripts/" + context.query.scriptgeneratorid
    : process.env.LOCAL_HOST + "get_recent_scripts/" + context.query.scriptgeneratorid;
  const res = await fetch(url1);
  const data = await res.json();

  const url2 = process.env.PROD == "true" ? process.env.PROD_INFLUENS_BACKEND + "get_script_generator_name/" + context.query.scriptgeneratorid
    : process.env.LOCAL_HOST + "get_script_generator_name/" + context.query.scriptgeneratorid;
  const get_script_generator_name_res = await fetch(url2);
  const script_generator_name_json = await get_script_generator_name_res.json();

  const script_generator_name = script_generator_name_json["script_generator_name"];

  // Pass data to the page via props
  return { props: { data, script_generator_name, session } }
}

ScriptGenerator.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ScriptGenerator;
