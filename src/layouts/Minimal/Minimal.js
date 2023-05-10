import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Backdrop, CircularProgress, Box, Typography } from '@material-ui/core';

import { Topbar } from './components';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '4rem',
    height: '100%'
  },
  content: {
    height: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    backgroundColor: theme.palette.background.loading,
    color: theme.palette.text.primary,
  },
}));

const Minimal = props => {
  const { children } = props;
  const classes = useStyles();

  const pageState = useSelector(state => ({
    ...state.page
  }), shallowEqual);

  return (
    <div className={classes.root}>
      <Topbar />
      <main className={classes.content}>{children}</main>
      <Backdrop className={classes.backdrop} open={pageState.isLoading}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="primary" size={24} />
          <Box mt={1}>
            <Typography variant="body1" color="inherit">Đang xử lý...</Typography>
          </Box>
        </Box>
      </Backdrop>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
