import { useMediaQuery, Backdrop, CircularProgress, Box, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Sidebar, Topbar } from './components';
import Content from './components/Content/Content';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '3.5rem',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '4rem'
    },
  },
  shiftContent: {
    paddingLeft: '15rem'
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

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const pageState = useSelector(state => ({
    ...state.page
  }), shallowEqual);

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        <Content inner={children} />
      </main>
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

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
