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
  disabled: {},
  textField: {
    marginBottom: theme.spacing(1)
  }
}))

export default function AddCategoryCluster({ open, onClose }) {
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

  const clearForm = () => {
    setFormState({
      isValid: false,
      values: {},
      touched: {},
      errors: {}
    });
  }

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
    clearForm();
  }

  const handleClickBtnAdd = () => {
    if (!formState.isValid)
      return;

    handleClose(true, { ...formState.values });
    clearForm();
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
        <DialogTitle id="form-dialog-title">Nhóm lĩnh vực mới</DialogTitle>
        <DialogContent>
          <form className={classes.content} onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              error={hasError('name')}
              fullWidth
              helperText={
                hasError('name') ? formState.errors.name[0] : null
              }
              label="Tên nhóm lĩnh vực"
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