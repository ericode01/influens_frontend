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

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';


import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
import RecentGenerators from 'src/content/Generators/ScriptGenerators/RecentGenerators';
import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"

const steps = ['Example 1', 'Example 2', 'Example 3', 'Example 4', 'Example 5'];

function ScriptGeneratorCreator({ session, endpoint }) {
    const [productNames, setProductNames] = useState([]);
    const [keywordsDescs, setkeywordsDescs] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [curProductName, setCurProductName] = useState();
    const [curKeywordsDesc, setCurkeywordsDesc] = useState();
    const [curScript, setCurScript] = useState();
    const [curScriptGeneratorName, setCurScriptGeneratorName] = useState();
    const [connotNext, setConnotNext] = useState(true);
    const [connotComplete, setConnotComplete] = useState(true);
    const router = useRouter();

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    useEffect(() => {
        if (curProductName == undefined || curKeywordsDesc == undefined || curScript == undefined
            || curProductName == '' || curKeywordsDesc == '' || curScript == '') {
            setConnotNext(true);
        }
        else {
            setConnotNext(false);
        }
    }, [curProductName, curKeywordsDesc, curScript]);

    useEffect(() => {
        if (curScriptGeneratorName == undefined || curScriptGeneratorName == '') {
            setConnotComplete(true);
        }
        else {
            setConnotComplete(false);
        }
    }, [curScriptGeneratorName]);

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);

        /* if (activeStep < productNames.length) {
            setCurProductName(productNames[activeStep]);
            setCurkeywordsDesc(keywordsDescs[activeStep]);
            setCurScript(scripts[activeStep]);
        }
        else {
            setCurProductName(undefined);
            setCurkeywordsDesc(undefined);
            setCurScript(undefined);
        } */
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        /* setCurProductName(productNames[activeStep]);
        setCurkeywordsDesc(keywordsDescs[activeStep]);
        setCurScript(scripts[activeStep]); */
    };

    useEffect(() => {
        if (activeStep < productNames.length) {
            setCurProductName(productNames[activeStep]);
            setCurkeywordsDesc(keywordsDescs[activeStep]);
            setCurScript(scripts[activeStep]);
        }
        else {
            setCurProductName('');
            setCurkeywordsDesc('');
            setCurScript('');
        }
    }, [activeStep]);


    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleProductNameChange = (e) => {
        if (productNames.length > activeStep) {
            const newProductNames = [...productNames];
            newProductNames[activeStep] = e.target.value;
            setProductNames(newProductNames);
        }
        else {
            setProductNames((names) => [...names, e.target.value]);
        }

        setCurProductName(e.target.value);
    }

    const handleKeywordsDescChange = (e) => {
        if (keywordsDescs.length > activeStep) {
            const newKeywordsDescs = [...keywordsDescs];
            newKeywordsDescs[activeStep] = e.target.value;
            setkeywordsDescs(newKeywordsDescs)
        }
        else {
            setkeywordsDescs((keywords) => [...keywords, e.target.value])
        }

        setCurkeywordsDesc(e.target.value);
    }

    const handleScriptChange = (e) => {
        if (scripts.length > activeStep) {
            const newScripts = [...scripts];
            newScripts[activeStep] = e.target.value;
            setScripts(newScripts)
        }
        else {
            setScripts((s) => [...s, e.target.value])
        }

        setCurScript(e.target.value);
    }

    const handleCurScriptGeneratorName = (e) => {
        setCurScriptGeneratorName(e.target.value);
    }

    const handleCompleteClick = (userId, endpoint) => {
        const url = endpoint + 'add_script_generator';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": userId,
                "script_generator_name": curScriptGeneratorName,
                "product_names": productNames,
                "keywords_descs": keywordsDescs,
                "scripts": scripts,
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log('error'));

        router.push({
            pathname: '/generators/scriptgenerators'
        });
    }

    const handleExitWithoutSave = (e) => {
        router.push({
            pathname: '/generators/scriptgenerators'
        });
    }

    return (
        <>
            <Head>
                <title>Script generator creator</title>
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
                                                value={curProductName}
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
                                                value={curKeywordsDesc}
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
                                                value={curScript}
                                            />
                                        </div>
                                        <Box sx={{ width: '100%' }}>
                                            <Stepper activeStep={activeStep} alternativeLabel>
                                                {steps.map((label, index) => {
                                                    const stepProps = {};
                                                    const labelProps = {};
                                                    if (isStepOptional(index)) {
                                                        labelProps.optional = (
                                                            <Typography variant="caption">Optional</Typography>
                                                        );
                                                    }
                                                    if (isStepSkipped(index)) {
                                                        stepProps.completed = false;
                                                    }
                                                    return (
                                                        <Step key={label} {...stepProps}>
                                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                                        </Step>
                                                    );
                                                })}
                                            </Stepper>
                                            {activeStep === steps.length - 1 ? (
                                                <>
                                                    <div>
                                                        <TextField
                                                            required
                                                            id="outlined-required"
                                                            label="Script generator name"
                                                            fullWidth
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            onChange={handleCurScriptGeneratorName}
                                                            value={curScriptGeneratorName}
                                                        // defaultValue="Product name"
                                                        />
                                                    </div>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                        <Button
                                                            sx={{ margin: 1 }}
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                        >
                                                            Back
                                                        </Button>
                                                        <Box sx={{ flex: '1 1 auto' }} />
                                                        <Button sx={{ margin: 1 }} variant="contained" color="success" disabled={connotNext || connotComplete} onClick={() => handleCompleteClick(session.user.user_id, endpoint)}>
                                                            Complete
                                                        </Button>
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                        <Button
                                                            sx={{ margin: 1 }}
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                        >
                                                            Back
                                                        </Button>
                                                        <Box sx={{ flex: '1 1 auto' }} />
                                                        {isStepOptional(activeStep) && (
                                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                                Skip
                                                            </Button>
                                                        )}
                                                        <Button sx={{ margin: 1 }} variant="contained" color="primary" onClick={handleNext} disabled={connotNext}>
                                                            Next
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
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

ScriptGeneratorCreator.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default ScriptGeneratorCreator;
