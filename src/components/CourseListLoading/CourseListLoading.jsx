import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '30rem'
  }
}));

export default function CourseListLoading({ height }) {
  const classes = useStyles();

  return (
    <Box className={classes.root} style={{ height }} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="primary" />
    </Box>
  )
}
