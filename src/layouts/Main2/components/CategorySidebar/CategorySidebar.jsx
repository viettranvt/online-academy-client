import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import CategorySidebarNav from './CategorySidebarNav/CategorySidebarNav';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: '15rem',
    [theme.breakpoints.up('lg')]: {
      marginTop: '4rem',
      height: 'calc(100% - 4rem)'
    },
    border: 0,
    ...theme.palette.primary.gradient,
    boxShadow: theme.palette.sidebar.boxShadow
  },
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    paddingRight: 0,
  },
  darkCover: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '15rem',
    height: '100vh',
    background: theme.palette.sidebar.background,
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  title: {
    color: theme.palette.text.secondary
  },
}));

const CategorySidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const classes = useStyles();
  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <PerfectScrollbar
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div className={classes.darkCover}></div>
        <CategorySidebarNav
          className={classes.nav}
          categoryClusters={appState.categoryClusterList || []}
        />
      </PerfectScrollbar>
    </Drawer>
  );
};

CategorySidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default CategorySidebar;