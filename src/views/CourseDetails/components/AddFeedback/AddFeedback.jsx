import {
  Box, Card,

  CardContent,




  IconButton, TextField, Typography
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import SendIcon from '@material-ui/icons/Send';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/styles';
import { courseApi } from 'api';
import clsx from 'clsx';
import { apiMessage } from 'constants/api-message.constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { showNotification } from 'redux/actions/app.action';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    background: theme.palette.background.course,
    borderRadius: 5
  },
  cardContent: {
    padding: '1rem !important'
  },
  comment: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  secondaryText: {
    color: theme.palette.text.secondary,
  },
  input: {
    ...theme.palette.input
  }
}));

const AddFeedback = props => {
  const { course, onAddComment, className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const userState = useSelector(state => ({
    ...state.user
  }), shallowEqual);

  const [rating, setRating] = useState(course.ownedRating);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const addFeedback = async (type, params) => {
    setLoading(true);
    try {
      await courseApi.addFeedback(course._id, params);

      // case: comment added
      if (type === 2) {
        setComment('');
        onAddComment();
      }

      setLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setLoading(false);
      }
    }
  }

  const handleChangeRating = (e) => {
    const { value } = e.target;
    setRating(+value);
    addFeedback(1, { rating: +value });
    dispatch(showNotification('success', 'Cảm ơn sự đánh giá của bạn 🥰'));
  }

  const handleChangeComment = (e) => {
    const { value } = e.target;
    setComment(value);
  }

  const handleClickBtnSend = () => {
    if (comment) {
      setComment('');
      addFeedback(2, { content: comment });
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.cardContent}>
        <Typography variant="h5" gutterBottom className={classes.secondaryText}><b>Đánh giá khóa học</b></Typography>
        <Rating
          name="rating"
          onChange={handleChangeRating}
          value={+rating}
        />
        <Box display="flex" alignItems="flex-end" className={classes.comment}>
          <Avatar alt={userState.authUser.fullName} src={userState.authUser.avatarUrl} className={classes.avatar} />
          <TextField
            label={`${userState.authUser.fullName}, bạn nghĩ gì về khóa học này?`}
            name="comment"
            onChange={handleChangeComment}
            onKeyUp={e => {
              if (e.keyCode === 13 && !loading)
                handleClickBtnSend();
            }}
            value={comment}
            variant="standard"
            fullWidth
            InputProps={{
              classes: {
                underline: classes.input
              }
            }}
          />
          <IconButton
            children={<SendIcon />}
            color="primary"
            style={{ marginLeft: 5 }}
            onClick={handleClickBtnSend}
            disabled={!comment}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

AddFeedback.propTypes = {
  className: PropTypes.string
};

export default AddFeedback;