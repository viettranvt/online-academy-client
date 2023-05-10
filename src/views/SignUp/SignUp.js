import {
  Button, Grid,
  Link, TextField,
  Typography,
  Box,
  IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, withRouter, useHistory } from 'react-router-dom';
import validate from 'validate.js';
import { useDispatch } from 'react-redux';
import { availablePages } from 'constants/global.constant';
import { showNotification, setLoading } from 'redux/actions/app.action';
import { apiMessage } from 'constants/api-message.constant';
import { authApi } from 'api';
import ConfirmAccount from 'components/ConfirmAccount/ConfirmAccount';
import { localStorageItems } from 'constants/local-storage.constant';
import { signIn } from 'redux/actions/user.action';
import * as _ from 'lodash';
import { setPageBasics } from 'redux/actions/page.action';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    ...theme.palette.primary.gradient
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    backgroundImage: 'url(https://cdn.dribbble.com/users/2260983/screenshots/5875334/_______1-8.png)',
    backgroundSize: 'cover'
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.paper,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.paper
  },
  bio: {
    color: theme.palette.paper
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.signUp,
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    padding: '6.25rem',
    flexBasis: '40.625rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(4, 0, 2, 0),
    ...theme.palette.primary.gradient
  },
  cover: {
    width: '25rem'
  },
  input: {
    ...theme.palette.input
  },
  icon: {
    color: theme.palette.text.primary
  }
}));

const SignUp = props => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [confirmAccountVisible, setConfirmAccountVisible] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));
    const params = { ...formState.values };
    try {
      const res = await authApi.register(params);
      dispatch(setLoading(false));
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      setConfirmAccountVisible(true);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(setLoading(false));
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  };

  const handleSubmitConfirmAccount = async () => {
    const params = {
      email: formState.values.email,
      password: formState.values.password
    }

    dispatch(setLoading(true));
    try {
      const res = await authApi.login(params);
      const { user, meta: { accessToken } } = res.data;
      localStorage.setItem(localStorageItems.ACCESS_TOKEN.name, accessToken);
      localStorage.setItem(localStorageItems.AUTH_USER.name, JSON.stringify(user));
      dispatch(signIn(user));
      dispatch(setLoading(false));

      if (history.location.state) {
        const { from } = history.location.state;
        history.push(from);
        return;
      }

      const firstPage = _.find(availablePages, page => page.auth && page.role === user.role);
      dispatch(setPageBasics(firstPage));
      history.push(firstPage.path);

    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(setLoading(false));
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          {!confirmAccountVisible ? (
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form
                  className={`${classes.form} animate__animated animate__fadeIn`}
                  onSubmit={handleSubmit}
                >
                  <Box ml={-1.5}>
                    <IconButton onClick={() => history.goBack()} className={classes.icon}>
                      <ArrowBackIcon />
                    </IconButton>
                  </Box>
                  <Typography
                    className={classes.title}
                    variant="h2"
                    gutterBottom
                  >
                    Đăng ký tài khoản học viên
                </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                  >
                    Hãy sử dụng địa chỉ email của bạn để đăng ký
                </Typography>
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
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="Mật khẩu"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="standard"
                    InputProps={{
                      classes: {
                        underline: classes.input
                      }
                    }}
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('confirmPassword')}
                    fullWidth
                    helperText={
                      hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
                    }
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.confirmPassword || ''}
                    variant="standard"
                    InputProps={{
                      classes: {
                        underline: classes.input
                      }
                    }}
                  />
                  <Button
                    className={classes.signUpButton}
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={!formState.isValid}
                  >
                    Đăng ký
                </Button>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Đã có tài khoản?{' '}
                    <Link
                      component={RouterLink}
                      to={availablePages.SIGN_IN.path}
                      variant="h6"
                    >
                      Đăng nhập
                  </Link>
                  </Typography>
                </form>
              </div>
            </div>
          ) : (
              <ConfirmAccount
                data={{ email: formState.values.email }}
                onSubmit={handleSubmitConfirmAccount}
                closeAllowed={false}
              />
            )}
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
