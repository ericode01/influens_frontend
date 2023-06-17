import { Typography, Button, Grid } from '@mui/material';
import NextLink from 'next/link';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Script Generators
        </Typography>
        <Typography variant="subtitle2">
          {/* {user.name}, these are your recent transactions */}
          These are your script generators
        </Typography>
      </Grid>
      <Grid item>
        <NextLink href={{ pathname: "/generators/scriptgenerators/scriptgeneratorcreator" }} passHref>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            color="success"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Create new script generator
          </Button>
        </NextLink>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
