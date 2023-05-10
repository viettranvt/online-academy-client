import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { APP_LOGO_IMAGE } from 'constants/global.constant';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.appLoading,
  },
  logoImage: {
    width: '4.5rem',
    height: '4.5rem',
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.4))',
    position: 'absolute',
    top: '49.5%',
    left: '50%',
    transform: 'translate(-50%,-49.5%)'
  },
  wave: {
    position: 'absolute',
    width: '100%',
    bottom: '-1rem'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  }
}));

const Loading = (props) => {
  const { open } = props;
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <img
        alt="Logo"
        src={APP_LOGO_IMAGE}
        className={classes.logoImage}
      />
      <div className={classes.progress}>
        <CircularProgress color="inherit" size={100} thickness={1} />
      </div>
      {/* <div className={classes.wave}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="url(#my-cool-gradient)" fillOpacity={1} d="M0,256L48,240C96,224,192,192,288,170.7C384,149,480,139,576,160C672,181,768,235,864,218.7C960,203,1056,117,1152,74.7C1248,32,1344,32,1392,32L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <linearGradient id="my-cool-gradient" x2="1" y2="1">
            <stop offset="0%" stopColor="#a4508b" />
            <stop offset="100%" stopColor="#5f0a87" />
          </linearGradient>
        </svg>
      </div> */}
    </Backdrop>
  );
};

Loading.propTypes = {
  open: PropTypes.bool
}

export default Loading;