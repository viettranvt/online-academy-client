import { Avatar, Box, Button, List, ListItem, ListItemIcon, ListItemText, Popover, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppsIcon from '@material-ui/icons/Apps';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { userRole } from 'constants/user-role.constant';
import * as _ from 'lodash';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  account: {
    textTransform: 'none',
    borderRadius: '3.125rem'
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  list__icon: {
    minWidth: 35,
    color: theme.palette.icon
  }
}));

function AccountMenu({ authUser, onClickItem }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickListItem = index => {
    setAnchorEl(null);
    onClickItem(index);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'account-menu' : undefined;

  return (
    <div>
      <Button aria-describedby={id} onClick={handleClick} className={classes.account}>
        <Box display="flex" alignItems="center" mx={2}>
          <Avatar src={authUser.avatarUrl} />
          <Box ml={1} display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="h5" style={{ textAlign: 'left' }}><b>{authUser.fullName}</b></Typography>
            <Typography variant="body2" style={{ textAlign: 'left', marginTop: 3 }}>
              {_.find(userRole, role => role.value === authUser.role).name}
            </Typography>
          </Box>
        </Box>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.list}
        >
          <ListItem button onClick={() => handleClickListItem(1)}>
            <ListItemIcon className={classes.list__icon}>
              <AppsIcon color="inherit" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Bảng điều khiển" />
          </ListItem>
          <ListItem button onClick={() => handleClickListItem(2)}>
            <ListItemIcon className={classes.list__icon}>
              <ExitToAppIcon color="inherit" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Popover>
    </div >

  )
}

export default React.memo(AccountMenu);
