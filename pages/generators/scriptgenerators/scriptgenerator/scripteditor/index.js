import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Generators/ScriptEditor/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { forwardRef, Ref, useState, ReactElement, ChangeEvent, useEffect } from 'react';
import {
    Grid,
    Container,
    Card,
    FormControl,
    FormLabel,
    TextField,
    Button,
    CardHeader,
    CardContent,
    Divider
} from '@mui/material';
import Footer from 'src/components/Footer';
import Box from '@mui/material/Box';

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
import RecentGenerators from 'src/content/Generators/ScriptGenerators/RecentGenerators';
import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"


function ScriptEditor({ data }) {
    const [productName, setProductName] = useState(data["product_name"]);
    const [keywordsDesc, setkeywordsDesc] = useState(data["keywords_desc"]);
    const [script, setScript] = useState(data["script"]);
    const router = useRouter();

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    }

    const handleKeywordsDescChange = (e) => {
        setkeywordsDesc(e.target.value);
    }

    const handleScriptChange = (e) => {
        setScript(e.target.value);
    }

    const handleGenerateScriptsClick = (e) => {

        fetch(process.env.PROD_INFLUENS_BACKEND+'generate_script_options', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "script_generator_id": router.query.scriptgeneratorid,
                "product_name": productName,
                "keywords_desc": keywordsDesc
            }),
        })
            .then((res) => res.json())
            .then((result) => setScript(result.generated_script_options))
            .catch((err) => console.log('error'));
    }

    const handleSaveClick = (status) => {

        fetch(process.env.PROD_INFLUENS_BACKEND+'edit_script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "recent_script_id": router.query.recentscriptid,
                "product_name": productName,
                "keywords_desc": keywordsDesc,
                "script": script,
                "status": status,
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log('error'));

        router.push({
            pathname: '/generators/scriptgenerators/scriptgenerator',
            query: { scriptgeneratorid: router.query.scriptgeneratorid },
        });
    }

    const handleExitWithoutSave = (e) => {
        router.push({
            pathname: '/generators/scriptgenerators/scriptgenerator',
            query: { scriptgeneratorid: router.query.scriptgeneratorid },
        });
    }

    return (
        <>
            <Head>
                <title>Edit Script</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Card>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={3}
                    >
                        {/* <Grid item xs={12}>
                            <RecentScripts />
                        </Grid> */}
                        <Grid item xs={12}>
                            <Card>
                                {/*                                 <CardHeader title="Input Fields" />
                                <Divider /> */}
                                <CardContent>
                                    <Box
                                        component="form"
                                        sx={{
                                            '& .MuiTextField-root': { m: 1 }
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div>
                                            <TextField
                                                required
                                                id="outlined-required"
                                                label="Product name"
                                                fullWidth
                                                style={{
                                                    width: '100%'
                                                }}
                                                onChange={handleProductNameChange}
                                                value={productName}
                                            // defaultValue="Product name"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                required
                                                id="outlined-required"
                                                label="Keywords or descriptions"
                                                // defaultValue="Keywords or description"
                                                helperText="Please provide keywords (at least 10) or descriptions of the product"
                                                multiline
                                                rows={5}
                                                style={{ width: '100%' }}
                                                onChange={handleKeywordsDescChange}
                                                value={keywordsDesc}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                id="outlined-required"
                                                label="Script"
                                                multiline
                                                rows={20}
                                                variant="outlined"
                                                style={{ width: '100%' }}
                                                onChange={handleScriptChange}
                                                value={script}
                                                helperText="Click the Generate scripts button below to generate three script options and edit in the text box above"
                                            />
                                        </div>
                                        <Button sx={{ margin: 1 }} variant="contained" color="success" onClick={handleGenerateScriptsClick}>
                                            Generate scripts
                                        </Button>
                                        <Button sx={{ margin: 1 }} variant="contained" color="warning" onClick={() => handleSaveClick("INPROGRESS")}>
                                            Save as In Progress
                                        </Button>
                                        <Button sx={{ margin: 1 }} variant="contained" color="primary" onClick={() => handleSaveClick("COMPLETED")}>
                                            Save as Completed
                                        </Button>
                                        <Button sx={{ margin: 1 }} variant="contained" color="error" onClick={handleExitWithoutSave}>
                                            Exit without save
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
            <Footer />
        </>
    );
}

/* export async function getStaticPaths() {
    // Fetch data from external API
    const res = await fetch("http://127.0.0.1:5000/get_all_script_generator_id_recent_script_id/1");
    const data = await res.json();

    const paths = data.map(e => ({
        params: {
            scriptgeneratorid: e.script_generator_id.toString(),
            recentscriptid: e.recent_script_id.toString()
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
    const res = await fetch(process.env.PROD_INFLUENS_BACKEND+"get_recent_script/" + context.query.recentscriptid);
    const data = await res.json();

    // Pass data to the page via props
    return { props: { data, session } }
}

ScriptEditor.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default ScriptEditor;
