import { Box, Dialog, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import React from 'react';
import NumberFormat from 'react-number-format';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  details: {
    minWidth: '25rem'
  },
  icon: {
    minWidth: 35,
    color: theme.palette.icon
  },
  btnViewCourses: {
    ...theme.palette.primary.gradient
  }
}))

export default function CategoryDetails(props) {
  const classes = useStyles();
  const { onClose, data, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <Box p={4} className={classes.details}>
        <Typography variant="h5"><b>{data.name}</b></Typography>
        <Box pt={3} pb={2} display="flex" justifyContent="space-between">
          <Typography variant="body2">Thuộc nhóm lĩnh vực</Typography>
          <Typography variant="body2" color="textPrimary">{data.categoryCluster.name}</Typography>
        </Box>
        <Box pb={2} display="flex" justifyContent="space-between">
          <Typography variant="body2">Số khóa học</Typography>
          <Typography variant="body2" color="textPrimary">
            <b><NumberFormat value={data.numberOfCourses} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} /></b>
          </Typography>
        </Box>
        <Box pb={2} display="flex" justifyContent="space-between">
          <Typography variant="body2">Cập nhật lần cuối</Typography>
          <Typography variant="body2" color="textPrimary">{moment(data.updatedAt).format('DD/MM/YYYY HH:mm')}</Typography>
        </Box>
        <Box pt={2}>
          <RouterLink to={data.href}>
            <Button
              fullWidth
              className={classes.btnViewCourses}
              variant="contained"
              size="large"
              color="primary"
            >
              Xem danh sách khóa học
            </Button>
          </RouterLink>
        </Box>
      </Box>
    </Dialog>
  )
}
