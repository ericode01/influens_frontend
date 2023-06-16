import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Generators/ScriptCreator/PageHeader';
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
import CircularProgress from '@mui/material/CircularProgress';

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
import RecentGenerators from 'src/content/Generators/ScriptGenerators/RecentGenerators';
import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"


function ScriptCreator({ session, endpoint }) {
    const [productName, setProductName] = useState();
    const [keywordsDesc, setkeywordsDesc] = useState();
    const [script, setScript] = useState();
    const [isGenerating, setIsGenerating] = useState(false);
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

    useEffect(() => {
        if (isGenerating) {
            fetch(endpoint + 'generate_script_options', {
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
                .then((result) => { setScript(result.generated_script_options); setIsGenerating(false); })
                .catch((err) => console.log('error'));
        }
    }, [isGenerating]);

    const handleSaveClick = (status, endpoint) => {
        const url = endpoint + 'add_new_script';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "script_generator_id": router.query.scriptgeneratorid,
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
                <title>Create Script</title>
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
                                                value={script ? script : ''}
                                                helperText="Click the Generate scripts button below to generate three script options and edit in the text box above"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Button sx={{ margin: 1 }} variant="contained" color="success" disabled={isGenerating} onClick={() => { setIsGenerating(true); }}>
                                                Generate scripts
                                            </Button>
                                            <Button sx={{ margin: 1 }} variant="contained" color="warning" disabled={isGenerating} onClick={() => handleSaveClick("INPROGRESS", endpoint)}>
                                                Save as In Progress
                                            </Button>
                                            <Button sx={{ margin: 1 }} variant="contained" color="primary" disabled={isGenerating} onClick={() => handleSaveClick("COMPLETED", endpoint)}>
                                                Save as Completed
                                            </Button>
                                            <Button sx={{ margin: 1 }} variant="contained" color="error" disabled={isGenerating} onClick={handleExitWithoutSave}>
                                                Exit without save
                                            </Button>
                                            {isGenerating && (
                                                <>
                                                    <div style={{ flexGrow: 1 }} />
                                                    <CircularProgress sx={{ margin: 2 }} color="success" />
                                                </>)
                                            }
                                        </div>
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
    // Return a list of possible value for id
    const paths = [
        {
            params: {
                scriptgeneratorid: "1"
            }
        },
        {
            params: {
                scriptgeneratorid: "2"
            }
        },
        {
            params: {
                scriptgeneratorid: "3"
            }
        }
    ];

    return {
        paths,
        fallback: false,
    };
} */

export async function getServerSideProps(context) {
    // Fetch necessary data for the blog post using params.id
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

    const endpoint = process.env.PROD == "true" ? process.env.PROD_INFLUENS_BACKEND : process.env.LOCAL_HOST;

    return {
        props: {
            session,
            endpoint,
        },
    };
}

ScriptCreator.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default ScriptCreator;
