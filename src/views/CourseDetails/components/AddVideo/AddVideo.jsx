import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import VideoUploading from 'components/VideoUploading/VideoUploading';
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import ImageUploading from 'components/ImageUploading/ImageUploading';
import { useDispatch } from 'react-redux';
import { showNotification } from 'redux/actions/app.action';
import { apiMessage } from 'constants/api-message.constant';

const schema = {
  title: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  video: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles(theme => ({
  content: {
  },
  formControl: {
    marginBottom: theme.spacing(2)
  },
  input: {
    ...theme.palette.input
  }
}))

export default function AddVideo({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    const { name } = event.target;
    let { value } = event.target;

    if (value === 'true')
      value = true;
    if (value === 'false')
      value = false;

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: value
      },
      touched: {
        ...formState.touched,
        [name]: true
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleVideoChange = (image) => {
    const name = 'video', value = image;
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: value
      },
      touched: {
        ...formState.touched,
        [name]: true
      }
    }));
  }

  const handleImageChange = (image) => {
    const name = 'thumbnail', value = image;
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: value
      },
      touched: {
        ...formState.touched,
        [name]: true
      }
    }));
  }

  const handleClose = (accepted) => {
    if (accepted) {
      if (!formState.isValid) {
        dispatch(showNotification('error', apiMessage.ADD_VIDEO_INVALID));
        return;
      }
    }

    let data = { ...formState.values };
    if (!data.thumbnail)
      delete data.thumbnail;

    onClose(accepted, data);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle id="form-dialog-title">Thêm video mới</DialogTitle>
        <DialogContent>
          <Box className={classes.content}>
            <form>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  error={hasError('title')}
                  helperText={
                    hasError('title') ? formState.errors.title[0] : null
                  }
                  label="Tựa đề video"
                  name="title"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.title || ''}
                  variant="standard"
                  InputProps={{
                    classes: {
                      underline: classes.input
                    }
                  }}
                  autoFocus
                />
              </FormControl>
            </form>
            <div className={classes.formControl}>
              <VideoUploading initVideoUrl={null} onVideoChange={handleVideoChange} />
            </div>
            <div className={classes.formControl}>
              <ImageUploading uploadText="Tải ảnh bìa lên" initImageUrl={null} onImageChange={handleImageChange} />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={() => handleClose(true)}
            color="primary"
          >
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}