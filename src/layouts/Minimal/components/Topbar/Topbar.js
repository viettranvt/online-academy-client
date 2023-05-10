import { AppBar, Box, Button, Grid, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { SearchInput } from 'components';
import AccountMenu from 'components/AccountMenu/AccountMenu';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { availablePages, APP_NAME, APP_LOGO_IMAGE } from 'constants/global.constant';
import { localStorageItems } from 'constants/local-storage.constant';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { switchDarkMode } from 'redux/actions/app.action';
import { signOut } from 'redux/actions/user.action';

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.palette.topbar
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  logo: {
    minWidth: '12.5rem'
  },
  logoImage: {
    width: '2.8125rem',
    marginTop: theme.spacing(-1)
  },
  logoTitle: {
    color: theme.palette.text.topbar,
    marginLeft: theme.spacing(1),
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 'bold',
  },
  btnSignIn: {

  },
  btnSignUp: {
    ...theme.palette.primary.gradient
  },
  searchInput: {
  },
  btnBrightness: {
    color: theme.palette.icon
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [openSignOutConfirmDialog, setOpenSignOutConfirmDialog] = useState(false);

  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  const userState = useSelector(state => ({
    ...state.user
  }));

  const handleClickAccountMenuItem = (index) => {
    switch (index) {
      case 1:
        const firstPage = _.find(availablePages, page => page.auth && page.role === userState.authUser.role);
        history.push(firstPage.path);
        break;

      case 2:
        setOpenSignOutConfirmDialog(true);
        break;

      default:
        break;
    }
  }

  const handleCloseSignOutConfirmDialog = (accepted) => {
    setOpenSignOutConfirmDialog(false);
    if (accepted) {
      localStorage.removeItem(localStorageItems.ACCESS_TOKEN.name);
      localStorage.removeItem(localStorageItems.AUTH_USER.name);
      dispatch(signOut());
      history.push(availablePages.SIGN_IN.path);
    }
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      position="fixed"
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <Box display="flex" alignItems="center" className={classes.logo}>
            <img
              alt="Logo"
              src={APP_LOGO_IMAGE}
              className={classes.logoImage}
            />
            <Typography variant="h5" className={classes.logoTitle}>{APP_NAME}</Typography>
          </Box>
        </RouterLink>
        <Grid container justify="flex-end" alignItems="center" spacing={2}>
          <Grid item>
            <div className={classes.searchInput}>
              <SearchInput />
            </div>
          </Grid>
          {!userState.authUser && (
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <RouterLink to={availablePages.SIGN_IN.path} className={classes.btnSignIn}>
                    <Button variant="outlined" color="primary">ĐĂNG NHẬP</Button>
                  </RouterLink>
                </Grid>
                <Grid item>
                  <RouterLink to={availablePages.SIGN_UP.path}>
                    <Button variant="contained" color="primary" className={classes.btnSignUp}>ĐĂNG KÝ</Button>
                  </RouterLink>
                </Grid>
              </Grid>
            </Grid>
          )}
          {userState.authUser && <AccountMenu authUser={userState.authUser} onClickItem={handleClickAccountMenuItem} />}
          <Grid item>
            <Tooltip title={appState.darkMode ? 'Bật chế độ sáng' : 'Bật chế độ tối'}>
              <IconButton onClick={() => dispatch(switchDarkMode())} className={classes.btnBrightness}>
                {appState.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
      <ConfirmDialog
        title="Xác nhận"
        content="Bạn thật sự muốn đăng xuất?"
        open={openSignOutConfirmDialog}
        onClose={handleCloseSignOutConfirmDialog}
      />
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
