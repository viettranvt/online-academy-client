import {
  Box, Button, Card,
  CardContent,
  TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import validate from 'validate.js';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.addCategory,
    boxShadow: 'none'
  },
  cardContent: {
    padding: '0 !important'
  },
  btnAdd: {
    height: '3rem',
    minWidth: '10.5rem',
    marginLeft: 5,
    ...theme.palette.primary.gradient
  },
  input: {
    ...theme.palette.input
  }
}));

const AddCategory = props => {
  const { onSubmit, className, ...rest } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [isFormCleared, setIsFormCleared] = useState(false);

  useEffect(() => {
    if (isFormCleared) {
      setIsFormCleared(false);
      return;
    }

    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    if (isFormCleared) {
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      });
    }
  }, [isFormCleared]);

  const handleSubmit = event => {
    event.preventDefault();
    handleClickBtnAdd();
  }

  const handleClickBtnAdd = () => {
    if (!formState.isValid)
      return;

    onSubmit(formState.values);
    setIsFormCleared(true);
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

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.cardContent}>
        <Box display="flex">
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Tên lĩnh vực"
              name="name"
              onChange={handleChange}
              value={formState.values.name || ''}
              variant="standard"
              fullWidth
              helperText={
                hasError('name') ? formState.errors.name[0] : null
              }
              InputProps={{
                classes: {
                  underline: classes.input
                }
              }}
            />
            <button type="submit" style={{ display: 'none' }}></button>
          </form>
          <Button
            startIcon={<AddIcon />}
            color="primary"
            variant="contained"
            className={classes.btnAdd}
            onClick={handleClickBtnAdd}
            disabled={!formState.isValid}
          >
            Thêm lĩnh vực
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

AddCategory.propTypes = {
  className: PropTypes.string
};

export default AddCategory;