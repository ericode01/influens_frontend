import { Card } from '@mui/material';
import RecentScriptsTable from './RecentScriptsTable';
import { subDays } from 'date-fns';

function RecentScripts({recentScripts}) {

  return (
    <Card>
      <RecentScriptsTable recentScripts={recentScripts} />
    </Card>
  );
}

export default RecentScripts;
