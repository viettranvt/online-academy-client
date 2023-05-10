import { Box, Button, Drawer, Fab, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Input, InputAdornment, InputLabel, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { courseApi } from 'api';
import ImageUploading from 'components/ImageUploading/ImageUploading';
import TextEditor from 'components/TextEditor/TextEditor';
import { apiMessage } from 'constants/api-message.constant';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { showNotification } from 'redux/actions/app.action';
import { setPageLoading } from 'redux/actions/page.action';
import validate from 'validate.js';

const schema = {
  thumbnail: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  title: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  description: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  content: {
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
  },
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

export default function UpdateCourse({ course, className, onUpdate }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawerRef = useRef();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  const { categoryClusterList } = appState;

  const originalFormData = {
    thumbnail: course.thumbnailUrl,
    title: course.title,
    categoryId: course.categoryCluster.categories[0]._id,
    tuition: course.tuition,
    discountPercent: course.discountPercent ? course.discountPercent * 100 : 0,
    isFinished: course.isFinished,
    description: course.description,
    content: course.content
  }
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      ...originalFormData
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

    const { name } = event.target;
    let { value } = event.target;

    if (value === 'true')
      value = true;
    if (value === 'false')
      value = false;

    if (name === 'discountPercent' && value) {
      if (value < 0) {
        value = 0;
      }

      if (value > 100)
        value = 100;
    }

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (open) {
      setFormState({ ...formState, values: { ...originalFormData } });
    }

    setState({ ...state, [anchor]: open });
  };

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

  const hanldeBtnUpdateClick = async () => {
    if (!formState.isValid) {
      dispatch(showNotification('error', apiMessage.UPDATE_COURSE_INVALID));
      return;
    }

    let params = {
      ...formState.values,
      discountPercent: formState.values.discountPercent / 100
    };

    if (typeof params.thumbnail === 'string')
      delete params.thumbnail;

    dispatch(setPageLoading(true))
    try {
      const res = await courseApi.update(course._id, params);
      const updatedData = res.data.course;
      setState({ ...state, [drawerRef.current.anchor]: false });
      onUpdate(updatedData);
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
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
        <Fab size="small" className={classes.btnClose} onClick={() => setState({ ...state, [anchor]: false })} >
          <CloseIcon />
        </Fab>
      </Box>

      <div className={classes.formControl}>
        <ImageUploading uploadText="Tải ảnh bìa lên" initImageUrl={formState.values.thumbnail} onImageChange={handleImageChange} />
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
                value={formState.values.tuition || ''}
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
            color="primary"
            fullWidth
            variant="contained"
            onClick={hanldeBtnUpdateClick}
            className={classes.btnSubmit}
            size="large"
          >
            Cập nhật thông tin khóa học
          </Button>
        </Box>
      </form>
    </div >
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            startIcon={<EditIcon />}
            onClick={toggleDrawer(anchor, true)}
            color="inherit"
            size="small"
            className={className}
          >
            Chỉnh sửa
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            ref={el => (drawerRef.current = { anchor })}
          >
            {content(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}