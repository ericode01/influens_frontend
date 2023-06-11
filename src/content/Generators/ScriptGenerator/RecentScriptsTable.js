import { useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import NextLink from 'next/link';

const getStatusLabel = (recentScriptStatus) => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    COMPLETED: {
      text: 'Completed',
      color: 'success'
    },
    INPROGRESS: {
      text: 'In Progress',
      color: 'warning'
    }
  };

  const { text, color } = map[recentScriptStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (recentScripts, filters) => {
  return recentScripts.filter((recentScript) => {
    let matches = true;

    if (filters.status && recentScript.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (recentScripts, page, limit) => {
  return recentScripts.slice(page * limit, page * limit + limit);
};

const RecentScriptsTable = ({ recentScripts }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredRecentScripts = applyFilters(recentScripts, filters);
  const paginatedRecentScripts = applyPagination(
    filteredRecentScripts,
    page,
    limit
  );
  const theme = useTheme();

  return (
    <Card>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        title="Recent Scripts"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prodcut Name</TableCell>
              {/* <TableCell>Status</TableCell> */}
              <TableCell>Created Timestamp</TableCell>
              <TableCell >Last Updated Timestamp</TableCell>
              <TableCell >Status</TableCell>
              <TableCell /* align="right" */>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecentScripts.map((recentScript) => {
              return (
                <TableRow hover key={recentScript.recent_script_id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {recentScript.product_name}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {format(cryptoOrder.orderDate, 'MMMM dd yyyy')}
                    </Typography> */}
                  </TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {recentScript.status}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {recentScript.created_timestamp}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {cryptoOrder.sourceDesc}
                    </Typography> */}
                  </TableCell>
                  <TableCell >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {recentScript.last_updated_timestamp}
                    </Typography>
                    {/*                     <Typography variant="body2" color="text.secondary" noWrap>
                      {numeral(cryptoOrder.amount).format(
                        `${cryptoOrder.currency}0,0.00`
                      )}
                    </Typography> */}
                  </TableCell>
                  <TableCell >
                    {getStatusLabel(recentScript.status)}
                  </TableCell>
                  <TableCell >
                    <NextLink href={{pathname: "/generators/scriptgenerators/scriptgenerator/scripteditor", query:{scriptgeneratorid: recentScript.script_generator_id, recentscriptid:recentScript.recent_script_id}}} passHref>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main,
                            mr: 1
                          }}
                          color="inherit"
                          size="small"
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </NextLink>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredRecentScripts.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentScriptsTable.propTypes = {
  recentScripts: PropTypes.array.isRequired
};

RecentScriptsTable.defaultProps = {
  recentScripts: []
};

export default RecentScriptsTable;
