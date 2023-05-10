import { Divider, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { availablePages } from 'constants/global.constant';
import PropTypes from 'prop-types';
import React from 'react';
import { UserInfo, SidebarNav } from './components';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import * as _ from 'lodash';
import { userRole } from 'constants/user-role.constant';

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
    backgroundColor: theme.palette.sidebar.background,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    border: 0
  },
  darkCover: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '15rem',
    height: '100vh',
    background: theme.palette.sidebar.background,
  },
  divider: {
    position: 'relative',
    zIndex: 5,
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.border.color
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const userState = useSelector(state => ({
    authUser: state.user.authUser
  }), shallowEqual)

  const classes = useStyles();

  let pages = [];

  if (userState.authUser) {
    pages = _.map(availablePages, page => ({
      ...page,
      href: page.path
    })).filter(page => page.auth && (page.role === userRole.GUEST.value || page.role === userState.authUser.role))
  }

  return (
    userState.authUser && (
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
      >
        <div
          {...rest}
          className={clsx(classes.root, className)}
        >
          <div className={classes.darkCover}></div>
          <UserInfo />
          <Divider className={classes.divider} />
          <SidebarNav
            className={classes.nav}
            pages={pages}
          />
        </div>
      </Drawer>
    )
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
