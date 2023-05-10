import {
  Box, Button, Card,

  CardContent,



  TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from 'redux/actions/app.action';
import { apiMessage } from 'constants/api-message.constant';
import { courseApi } from 'api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.course,
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    width: '100%'
  },
  cardContent: {
  },
  btnAdd: {
    height: '2.625rem',
    minWidth: '10.625rem',
    ...theme.palette.primary.gradient,
  },
  input: {
    ...theme.palette.input
  }
}));

const AddChapter = props => {
  const { course, onAdd, className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const handleChange = event => {
    setTitle(event.target.value);
  };

  const handleKeyUp = event => {
    if (event.keyCode === 13) {
      handleClickBtnAdd();
    }
  }

  const handleClickBtnAdd = async () => {
    if (!title) {
      dispatch(showNotification('error', apiMessage.ADD_CHAPTER_INVALID));
      return;
    }

    try {
      const res = await courseApi.addChapter(course._id, { title });
      onAdd(res.data.chapter);
      setTitle('');
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.cardContent}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Tiêu đề chương"
            name="name"
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            value={title}
            variant="standard"
            fullWidth
            InputProps={{
              classes: {
                underline: classes.input
              }
            }}
          />
          <Box mt={1} ml={0.5}>
            <Button
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              className={classes.btnAdd}
              disabled={!title}
              onClick={handleClickBtnAdd}
            >
              Thêm chương
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

AddChapter.propTypes = {
  className: PropTypes.string
};

export default AddChapter;