import { Box, Button, Drawer, Fab, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Input, InputAdornment, InputLabel, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ImageUploading from 'components/ImageUploading/ImageUploading';
import TextEditor from 'components/TextEditor/TextEditor';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shallowEqual } from 'recompose';
import validate from 'validate.js';
import { apiMessage } from 'constants/api-message.constant';
import { showNotification } from 'redux/actions/app.action';
import { setPageLoading } from 'redux/actions/page.action';
import { courseApi } from 'api';

const schema = {
  thumbnail: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  title: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  tuition: {
    presence: { allowEmpty: false, message: 'is required' },
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 999999999
    }
  },
  discountPercent: {
    presence: { allowEmpty: false, message: 'is required' },
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 100
    }
  }
}

const useStyles = makeStyles((theme) => ({
  content: {
    width: '37.5rem',
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0)
  },
  formControl: {
    marginBottom: theme.spacing(2)
  },
  btnSubmit: {
    ...theme.palette.primary.gradient
  },
  input: {
    ...theme.palette.input
  },
  icon: {
    color: theme.palette.icon
  },
  btnClose: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.icon,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.icon,
      boxShadow: 'none',
    }
  }
}));

export default function AddCourse({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const anchor = 'right';

  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  const { categoryClusterList } = appState;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      thumbnail: '',
      title: '',
      categoryId: '',
      tuition: 0,
      discountPercent: 0,
      isFinished: false,
      description: '',
      content: '',
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    if (categoryClusterList.length > 0) {
      let defaultCategoryId = '';
      if (categoryClusterList.length > 0) {
        for (const cc of categoryClusterList) {
          if (cc.categories.length > 0) {
            defaultCategoryId = cc.categories[0]._id;
            break;
          }
        }
      }

      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          categoryId: defaultCategoryId
        }
      }));
    }
  }, [categoryClusterList]);

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

  const handleTextEditorChange = (text) => {
    const name = 'content', value = text;
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

  const hanldeBtnAddClick = async () => {
    if (!formState.isValid) {
      dispatch(showNotification('error', apiMessage.ADD_COURSE_INVALID));
      return;
    }

    dispatch(setPageLoading(true));
    const params = {
      ...formState.values,
      discountPercent: formState.values.discountPercent / 100
    };

    try {
      const res = await courseApi.add(params);
      const message = apiMessage[res.messages[0]];
      onClose(null, message);
      dispatch(setPageLoading(false));
      dispatch(showNotification('success', message));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]] || error.messages[0]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const content = (anchor) => (
    <div
      className={classes.content}
      role="presentation"
    >
      <Box my={2}>
        <Fab size="small" className={classes.btnClose} onClick={e => onClose(e)} >
          <CloseIcon />
        </Fab>
      </Box>

      <div className={classes.formControl}>
        <ImageUploading uploadText="Tải ảnh bìa lên" initImageUrl={null} onImageChange={handleImageChange} />
      </div>

      <form>
        <FormControl className={classes.formControl} fullWidth>
          <TextField
            error={hasError('title')}
            helperText={
              hasError('title') ? formState.errors.title[0] : null
            }
            label="Tên khóa học"
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
          />
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="grouped-native-select">Lĩnh vực</InputLabel>
          <Select
            name="categoryId"
            native
            value={formState.values.categoryId}
            onChange={handleChange}
            className={classes.input}
            inputProps={{
              classes: {
                icon: classes.icon
              }
            }}
          >
            {categoryClusterList.map(cc => (
              <optgroup key={cc._id} label={cc.name}>
                {cc.categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={9}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="standard-adornment-amount">Học phí</InputLabel>
              <Input
                error={hasError('tuition')}
                name="tuition"
                onChange={handleChange}
                type="number"
                value={formState.values.tuition}
                variant="standard"
                endAdornment={<InputAdornment position="end">đ</InputAdornment>}
                inputProps={{ min: 0, max: 99999999 }}
                classes={{ underline: classes.input }}
              />
              <FormHelperText>{hasError('tuition') ? formState.errors.tuition[0] : null}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="standard-adornment-amount">Ưu đãi</InputLabel>
              <Input
                error={hasError('discountPercent')}
                name="discountPercent"
                onChange={handleChange}
                type="number"
                value={formState.values.discountPercent}
                variant="standard"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                inputProps={{ min: 0, max: 100 }}
                classes={{ underline: classes.input }}
              />
              <FormHelperText>{hasError('discountPercent') ? formState.errors.discountPercent[0] : null}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl className={classes.formControl} component="fieldset" fullWidth>
          <Box display="flex" alignItems="center">
            <Box mr={4}>
              <FormLabel component="legend">
                <Typography variant="body2" color="textPrimary">Trạng thái khóa học</Typography>
              </FormLabel>
            </Box>
            <RadioGroup row name="isFinished" value={formState.values.isFinished} onChange={handleChange}>
              <FormControlLabel value={true} control={<Radio color="primary" />} label="Đã hoàn thành" />
              <FormControlLabel value={false} control={<Radio color="primary" />} label="Chưa hoàn thành" />
            </RadioGroup>
          </Box>
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <TextField
            className={classes.formControl}
            error={hasError('description')}
            fullWidth
            helperText={
              hasError('description') ? formState.errors.description[0] : null
            }
            label="Mô tả khóa học"
            name="description"
            onChange={handleChange}
            type="text"
            value={formState.values.description || ''}
            variant="standard"
            multiline
            InputProps={{
              classes: {
                underline: classes.input
              }
            }}
          />
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <FormLabel component="legend">Nội dung khóa học</FormLabel>
          <Box mt={2} style={{ height: '25rem' }}>
            <TextEditor height={'89.5%'} defaultValue={formState.values.content} onChange={handleTextEditorChange} />
          </Box>
        </FormControl>

        <Box mt={2}>
          <Button
            className={classes.btnSubmit}
            color="primary"
            fullWidth
            variant="contained"
            onClick={hanldeBtnAddClick}
            size="large"
          >
            Đăng khóa học
          </Button>
        </Box>
      </form>
    </div >
  );

  return (
    <Drawer anchor={anchor} open={open} onClose={e => onClose(e)}>
      {content(anchor)}
    </Drawer>
  );
}