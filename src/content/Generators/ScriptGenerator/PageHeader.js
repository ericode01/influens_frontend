import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ArrowBackIosNewTwoToneIcon from '@mui/icons-material/ArrowBackIosNewTwoTone';
import NextLink from 'next/link';

function PageHeader({scriptgeneratorid, script_generator_name}) {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {script_generator_name}
        </Typography>
        <Typography variant="subtitle2">
          {/* {user.name}, these are your recent transactions */}
         View the history or create new script
        </Typography>
      </Grid>
      <Grid item>
      <NextLink href={{pathname: "/generators/scriptgenerators/scriptgenerator/scriptcreator", query: {scriptgeneratorid: scriptgeneratorid}}} passHref>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          color="success"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create new script
        </Button>
        </NextLink>
        <NextLink href={"/generators/scriptgenerators"} passHref>
        <Button
          sx={{ mt: { xs: 2, md: 0 }, ml: { xs: 0, sm:1, md: 2 } }}
          variant="contained"
          startIcon={<ArrowBackIosNewTwoToneIcon fontSize="small" />}
        >
          Script Generators
        </Button>
        </NextLink>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
