import { Avatar, Box, Card, CardActionArea, CardContent, Dialog, Grid, Typography, DialogTitle, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import * as moment from 'moment';
import Rating from '@material-ui/lab/Rating';
import NumberFormat from 'react-number-format';
import StarIcon from '@material-ui/icons/Star';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { lecturerApi, userApi } from 'api';
import { useDispatch } from 'react-redux';
import { apiMessage } from 'constants/api-message.constant';
import { showNotification } from 'redux/actions/app.action';
import LockIcon from '@material-ui/icons/Lock';
import DeleteIcon from '@material-ui/icons/Delete';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { setPageLoading } from 'redux/actions/page.action';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.user,
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
  },
  avatar: {
    width: '5rem',
    height: '5rem'
  },
  details: {
    minWidth: '25rem'
  },
  details__avatar: {
    width: '7.5rem',
    height: '7.5rem'
  },
  details__numberOfRatings: {
    position: 'absolute',
    bottom: 0,
    right: '20%',
    ...theme.palette.primary.gradient,
    color: theme.palette.primary.contrastText,
    padding: '0.1563rem 0.3125rem',
    borderRadius: '0.625rem'
  },
  label__blocked: {
    background: 'rgba(223, 71, 89, 0.1)',
    color: '#df4759',
    fontWeight: 'bold',
    padding: theme.spacing(0.5, 1),
    borderRadius: '1.5rem',
    width: 'fit-content'
  }
}))

function Details(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, data, open } = props;
  const [openRemoveAccountConfirmDialog, setOpenRemoveAccountConfirmDialog] = useState(false);
  const [openBlockAccountConfirmDialog, setOpenBlockAccountConfirmDialog] = useState(false);
  const [openUnblockAccountConfirmDialog, setOpenUnblockAccountConfirmDialog] = useState(false);

  const handleCloseRemoveAccountConfirmDialog = async (accepted) => {
    setOpenRemoveAccountConfirmDialog(false);
    if (accepted) {
      dispatch(setPageLoading(true));
      try {
        const res = await lecturerApi.delete(data._id);
        onClose('remove');
        dispatch(showNotification('success', apiMessage[res.messages[0]]));
        dispatch(setPageLoading(false));
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
          dispatch(setPageLoading(false));
        }
      }
    }
  }

  const handleClickBtnRemoveAccount = () => {
    setOpenRemoveAccountConfirmDialog(true);
  }

  const handleCloseBlockAccountConfirmDialog = async (accepted) => {
    setOpenBlockAccountConfirmDialog(false);
    if (accepted) {
      dispatch(setPageLoading(true));
      try {
        await userApi.updateByAdminRole(data._id, { isBlocked: true });
        onClose('block');
        dispatch(showNotification('success', apiMessage.BLOCK_USER_SUCCESSFULLY));
        dispatch(setPageLoading(false));
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
          dispatch(setPageLoading(false));
        }
      }
    }
  }

  const handleClickBtnBlockAccount = () => {
    setOpenBlockAccountConfirmDialog(true);
  }

  const handleCloseUnblockAccountConfirmDialog = async (accepted) => {
    setOpenUnblockAccountConfirmDialog(false);
    if (accepted) {
      dispatch(setPageLoading(true));
      try {
        await userApi.updateByAdminRole(data._id, { isBlocked: false });
        onClose('unblock');
        dispatch(showNotification('success', apiMessage.UNBLOCK_USER_SUCCESSFULLY));
        dispatch(setPageLoading(false));
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
          dispatch(setPageLoading(false));
        }
      }
    }
  }

  const handleClickBtnUnblockAccount = () => {
    setOpenUnblockAccountConfirmDialog(true);
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Thông tin giảng viên</DialogTitle>
      <Box p={6} className={classes.details}>
        <Box display="flex" justifyContent="center">
          <Avatar src={data.avatarUrl} className={classes.details__avatar} />
        </Box>
        <Box py={2} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" gutterBottom><b>{data.fullName}</b></Typography>
          <Typography variant="body2" gutterBottom>{data.email}</Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" style={{ marginRight: 3 }}>
              {/* {`${Math.floor(data.roleInfo.averageRating)}.${(data.roleInfo.averageRating - Math.floor(data.roleInfo.averageRating)) * 10}`} */}
              {data.roleInfo.averageRating}
            </Typography>
            <Box style={{ marginBottom: 1 }}>
              <Rating name="read-only" value={data.roleInfo.averageRating} size="small" precision={0.5} readOnly />
            </Box>
          </Box>
          <Box>
            <Typography variant="body2">
              <span>(</span>
              <NumberFormat value={data.roleInfo.numberOfRatings} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' lượt đánh giá'} />
              <span>)</span>
            </Typography>
          </Box>
        </Box>
        <Box py={4}>
          <Box pb={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">Ngày tham gia</Typography>
            <Typography variant="body2" color="textPrimary">{moment(data.createdAt).format('DD/MM/YYYY')}</Typography>
          </Box>
          <Box pb={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">Số khóa học đã đăng tải</Typography>
            <Typography variant="body2" color="textPrimary">
              <NumberFormat value={data.roleInfo.numberOfCoursesPosted} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
            </Typography>
          </Box>
          <Box pb={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">Số học viên đã theo học</Typography>
            <Typography variant="body2" color="textPrimary">
              <NumberFormat value={data.roleInfo.numberOfStudents} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
            </Typography>
          </Box>
        </Box>
        <Box pt={6}>
          <Box my={2}>
            {!data.isBlocked ? (
              <Button
                variant="outlined"
                fullWidth
                color="secondary"
                onClick={handleClickBtnBlockAccount}
                startIcon={<LockIcon fontSize="small" />}
              >
                Khóa tài khoản
              </Button>
            ) : (
                <div style={{ color: '#00c853' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="inherit"
                    onClick={handleClickBtnUnblockAccount}
                    startIcon={<LockOpenIcon fontSize="small" />}
                  >
                    Mở khóa tài khoản
                </Button>
                </div>
              )}
          </Box>
          <Box style={{ color: '#717171' }}>
            <Button
              variant="outlined"
              fullWidth
              color="inherit"
              onClick={handleClickBtnRemoveAccount}
              startIcon={<DeleteIcon fontSize="small" />}
            >
              Xóa tài khoản
          </Button>
          </Box>
        </Box>
      </Box>
      <ConfirmDialog
        title="Xác nhận"
        content="Bạn thật sự muốn xóa tài khoản này?"
        open={openRemoveAccountConfirmDialog}
        onClose={handleCloseRemoveAccountConfirmDialog}
      />
      {!data.isBlocked ? (
        <ConfirmDialog
          title="Xác nhận"
          content="Bạn thật sự muốn khóa tài khoản này?"
          open={openBlockAccountConfirmDialog}
          onClose={handleCloseBlockAccountConfirmDialog}
        />
      ) : (
          <ConfirmDialog
            title="Xác nhận"
            content="Bạn thật sự muốn mở khóa tài khoản này?"
            open={openUnblockAccountConfirmDialog}
            onClose={handleCloseUnblockAccountConfirmDialog}
          />
        )}
    </Dialog>
  );
}

export default function Lecturer({ data, onRemove, onBlock, onUnblock }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (message) => {
    setOpen(false);

    switch (message) {
      case 'remove':
        onRemove(data._id);
        break;

      case 'block':
        onBlock(data._id);
        break;

      case 'unblock':
        onUnblock(data._id);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Card className={classes.card} onClick={handleClickOpen}>
        <CardActionArea>
          <CardContent style={{ padding: 0 }}>
            <Box p={2}>
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Box position="relative">
                    <Avatar src={data.avatarUrl} className={classes.avatar} />
                    <Box display="flex" justifyContent="center" alignItems="center" className={classes.details__numberOfRatings}>
                      <StarIcon style={{ color: '#ffb600', fontSize: '0.875rem' }} />
                      <Typography variant="body2" color="inherit" style={{ marginLeft: 3 }}>
                        {/* {`${Math.floor(data.roleInfo.averageRating)}.${(data.roleInfo.averageRating - Math.floor(data.roleInfo.averageRating)) * 10}`} */}
                        {data.roleInfo.averageRating}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h5" gutterBottom><b>{data.fullName}</b></Typography>
                  <Typography variant="body2" gutterBottom={data.isBlocked}>{data.email}</Typography>
                  {data.isBlocked && (<Typography variant="body2" className={classes.label__blocked}>Đã bị khóa</Typography>)}
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <Details
        onClose={handleClose}
        data={data}
        open={open}
      />
    </div>
  )
}