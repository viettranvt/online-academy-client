import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Fab } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    bottom: '4%',
    right: '1.25%',
    zIndex: 100
  }
}))

export default function ScrollTopButton({ onClick }) {
  const classes = useStyles();

  return (
    <Fab
      size="large"
      color="primary"
      aria-label="scroll-top"
      className={`${classes.root} animate__animated animate__bounceIn`}
      onClick={onClick}
    >
      <KeyboardArrowUpIcon fontSize="large" />
    </Fab>
  )
}
