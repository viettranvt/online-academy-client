import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { categoryClusterApi } from 'api';
import Loading from 'components/Loading/Loading';
import { Notification } from 'components/Notification';
import { apiMessage } from 'constants/api-message.constant';
import { availablePages } from 'constants/global.constant';
import { createBrowserHistory } from 'history';
import React, { useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Router } from 'react-router-dom';
import { hideNotification, setAppCategoryClusterList, showNotification } from 'redux/actions/app.action';
import darkPalette from 'theme/dark-palette';
import darkTypography from 'theme/dark-typography';
import palette from 'theme/palette';
import typography from 'theme/typography';
import validate from 'validate.js';
import './assets/scss/index.scss';
import validators from './common/validators';
import { chartjs } from './helpers';
import Routes from './Routes';
import theme from './theme';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const App = () => {
  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  let appTheme = !appState.darkMode ?
    createMuiTheme(
      {
        ...theme,
        palette,
        typography
      }
    ) : createMuiTheme(
      {
        ...theme,
        palette: darkPalette,
        typography: darkTypography
      }
    );

  const overrides = {
    ...appTheme.overrides
  }
  appTheme = { ...appTheme, overrides };

  document.body.style.backgroundColor = appTheme.palette.background.default;

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllCategoryClusters = async () => {
      try {
        const res = await categoryClusterApi.getAll();
        const newCategoryClusterList = res.data.entries.map(cc => ({
          ...cc,
          categories: cc.categories.map(c => ({ ...c, href: availablePages.CATEGORY_COURSES.path.replace(':categoryId', c._id) }))
        }));
        dispatch(setAppCategoryClusterList(newCategoryClusterList));
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
        }
      }
    }
    getAllCategoryClusters();
  }, []);

  const handleCloseNotification = () => {
    dispatch(hideNotification());
  }

  return (
    <ThemeProvider theme={appTheme}>
      <Router history={browserHistory}>
        <Routes />
      </Router>
      <Loading open={appState.isLoading} />
      <Notification
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={appState.isNotificationOpened}
        type={appState.notification.type}
        message={appState.notification.message}
        onClose={handleCloseNotification}
      />
    </ThemeProvider>
  );
}

export default App;
