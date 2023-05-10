import { Button, List, ListItem, ListItemIcon, ListItemText, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Image from 'material-ui-image';
import React, { useRef, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '18.75rem'
  },
  darkCover: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  btnContrast: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)'
    },
    backdropFilter: 'blur(6px)'
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

export default function ImageUploading({ uploadText, initImageUrl, onImageChange }) {
  const classes = useStyles();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initImageUrl);
  const [uploadingVisible, setUploadingVisible] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const btnUploadRef = useRef();

  const handleClickBtnEdit = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEditMenu = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let image = e.target.files[0];

    reader.onloadend = () => {
      onImageChange(image);
      setImagePreviewUrl(reader.result);
    }

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  const handleMouseOver = (e) => {
    if (uploadingVisible && !imagePreviewUrl)
      return;

    setUploadingVisible(true);
  }

  const handleMouseOut = (e) => {
    if (!imagePreviewUrl)
      return;

    setUploadingVisible(false);
  }

  const handleClickEditMenuItem = index => {
    setAnchorEl(null);
    switch (index) {
      case 1:
        if (btnUploadRef.current) {
          btnUploadRef.current.click();
        }
        break;
      case 2:
        setImagePreviewUrl('');
        onImageChange('');
        break;

      default:
        break;
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'image-uploading-edit-menu' : undefined;

  return (
    <div className={classes.root}>
      <div
        className={classes.darkCover}
        style={{ opacity: uploadingVisible ? 1 : 0 }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <input
          accept="image/*"
          id="image-upload"
          type="file"
          onChange={handleImageChange}
          hidden
        />
        <label
          htmlFor="image-upload"
          style={{ color: '#fff', display: uploadingVisible && !imagePreviewUrl ? 'block' : 'none' }}
        >
          <Button ref={el => (btnUploadRef.current = el)} startIcon={<CloudUploadIcon />} className={classes.btnContrast} component="span">
            {uploadText}
          </Button>
        </label>

        {imagePreviewUrl && (
          <React.Fragment>
            <Button startIcon={<PhotoCameraIcon />} aria-describedby={id} onClick={handleClickBtnEdit} className={classes.btnContrast}>
              Chỉnh sửa ảnh
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseEditMenu}
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
                <ListItem button onClick={() => handleClickEditMenuItem(1)}>
                  <ListItemIcon className={classes.list__icon}>
                    <CloudUploadIcon color="inherit" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={uploadText} />
                </ListItem>
                <ListItem button onClick={() => handleClickEditMenuItem(2)}>
                  <ListItemIcon className={classes.list__icon}>
                    <DeleteIcon color="inherit" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Gỡ" />
                </ListItem>
              </List>
            </Popover>
          </React.Fragment>
        )}

      </div>
      {imagePreviewUrl && (
        <Image
          src={imagePreviewUrl}
          aspectRatio={(16 / 9)}
          disableSpinner
          style={{ position: 'absolute', width: '100%' }}
        />
      )}
    </div>
  )
}
