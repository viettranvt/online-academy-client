import { Box, Typography } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    height: '30rem'
  },
  icon: {
    fontSize: '4.375rem',
    color: theme.palette.icon
  }
}));

export default function CourseListEmpty() {
  const classes = useStyles();

  return (
    <Box className={classes.root} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box mb={1}>
        <SchoolIcon className={classes.icon} />
      </Box>
      <Typography variant="subtitle2">Chưa có khóa học nào.</Typography>
    </Box>
  )
}