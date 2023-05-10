import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
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
  disabled: {}
}))

export default function UpdateCategory({ data, open, onClose }) {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      name: data.name
    },
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

  const handleClickBtnSave = () => {
    if (!formState.isValid)
      return;

    handleClose(true, { ...formState.values });
  }

  const handleSubmit = e => {
    e.preventDefault();
    handleClickBtnSave();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Chỉnh sửa lĩnh vực</DialogTitle>
        <DialogContent>
          <form className={classes.content} onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              error={hasError('name')}
              fullWidth
              helperText={
                hasError('name') ? formState.errors.name[0] : null
              }
              label="Tên lĩnh vực"
              name="name"
              onChange={handleChange}
              type="text"
              value={formState.values.name || ''}
              variant="standard"
              InputProps={{
                classes: {
                  underline: classes.input
                }
              }}
              autoFocus
            />
            <button type="submit" style={{ display: 'none' }}></button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false, null)} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleClickBtnSave}
            color="primary"
            disabled={!formState.isValid || formState.values.name === data.name}
            classes={{
              root: classes.root,
              disabled: classes.disabled
            }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
