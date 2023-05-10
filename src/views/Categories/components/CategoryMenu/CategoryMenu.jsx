import { IconButton, List, ListItem, ListItemIcon, ListItemText, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  btnIcon: {
    color: theme.palette.icon
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

function CategoryMenu({ onClickList }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickList = (index) => {
    onClickList(index);
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick} className={classes.btnIcon}>
        <MoreVertIcon />
      </IconButton>
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
          <ListItem button onClick={() => handleClickList(1)}>
            <ListItemIcon className={classes.list__icon}>
              <InfoIcon color="inherit" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Xem chi tiết" />
          </ListItem>
          <ListItem button onClick={() => handleClickList(2)}>
            <ListItemIcon className={classes.list__icon}>
              <EditIcon color="inherit" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Chỉnh sửa" />
          </ListItem>
          <ListItem button onClick={() => handleClickList(3)}>
            <ListItemIcon className={classes.list__icon}>
              <DeleteIcon color="inherit" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Xóa" />
          </ListItem>
        </List>
      </Popover>
    </div >

  )
}

export default React.memo(CategoryMenu);