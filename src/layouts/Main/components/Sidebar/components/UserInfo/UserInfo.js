import { Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { availablePages } from 'constants/global.constant';
import { userRole } from 'constants/user-role.constant';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { shallowEqual } from 'recompose';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: '3.375rem',
    height: '3.375rem',
    marginTop: theme.spacing(2)
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const UserInfo = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const userState = useSelector(state => ({
    authUser: state.user.authUser
  }), shallowEqual);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={userState.authUser.avatarUrl}
        to={availablePages.PROFILE.path}
      />
      <Typography
        className={classes.name}
        variant="h5"
      >
        {userState.authUser.fullName}
      </Typography>
      <Typography variant="body2">
        {_.find(userRole, role => role.value === userState.authUser.role).name}
      </Typography>
    </div>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string
};

export default UserInfo;
