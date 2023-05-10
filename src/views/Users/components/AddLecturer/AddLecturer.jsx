import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';

const schema = {
  fullName: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  }
};

const useStyles = makeStyles(theme => ({
  content: {
    minWidth: '18.75rem'
  },
  root: {
    '&$disabled': {
      color: theme.palette.text.disabled,
    },
  },
  disabled: {},
  textField: {
    marginBottom: theme.spacing(1)
  }
}))

export default function AddLecturer({ open, onClose }) {
  const classes = useStyles();

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

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleClose = (accepted, data) => {
    onClose(accepted, data);
  }

  const handleClickBtnAdd = () => {
    if (!formState.isValid)
      return;

    handleClose(true, { ...formState.values });
  }

  const handleSubmit = e => {
    e.preventDefault();
    handleClickBtnAdd();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Giảng viên mới</DialogTitle>
        <DialogContent>
          <form className={classes.content} onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              error={hasError('fullName')}
              fullWidth
              helperText={
                hasError('fullName') ? formState.errors.fullName[0] : null
              }
              label="Họ và tên"
              name="fullName"
              onChange={handleChange}
              type="text"
              value={formState.values.fullName || ''}
              variant="standard"
              InputProps={{
                classes: {
                  underline: classes.input
                }
              }}
              autoFocus
            />
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Địa chỉ email"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="standard"
              InputProps={{
                classes: {
                  underline: classes.input
                }
              }}
            />
            <button type="submit" style={{ display: 'none' }}></button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false, null)} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleClickBtnAdd}
            color="primary"
            disabled={!formState.isValid}
            classes={{
              root: classes.root,
              disabled: classes.disabled
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}