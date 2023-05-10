import { availablePages } from 'constants/global.constant';
import { localStorageItems } from 'constants/local-storage.constant';
import { userRole } from 'constants/user-role.constant';
import * as _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import { GuardProvider } from 'react-router-guards';
import { shallowEqual } from 'recompose';
import { hideNotification, setLoading } from 'redux/actions/app.action';
import { setPageBasics } from 'redux/actions/page.action';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Main2 as Main2Layout, Minimal as MinimalLayout } from './layouts';
import {
  CategoryCourses as CategoryCoursesView,

  CourseDetails as CourseDetailsView, CourseSearching as CourseSearchingView, Home as HomeView,






  NotFound as NotFoundView, Profile as ProfileView, SignIn as SignInView, SignUp as SignUpView
} from './views';

const Routes = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const authUser = useSelector(state => ({
    ...state.user.authUser
  }), shallowEqual);

  const requireLogin = (to, from, next) => {
    dispatch(setLoading(false));
    dispatch(hideNotification());

    const accessToken = localStorage.getItem(localStorageItems.ACCESS_TOKEN.name);
    const isAuthenticated = !!accessToken && !!authUser;
    const toPath = to.location.pathname;

    if (isAuthenticated) {
      const authUserPages = _.filter(availablePages, page => page.role === userRole.GUEST.value || (page.auth && page.role === authUser.role));

      if ([availablePages.SIGN_IN.path, availablePages.SIGN_UP.path].includes(toPath)) {
        const firstPage = _.find(authUserPages, page => page.type === 'FIRST_BY_ROLE');
        next.redirect(firstPage.path);
      }
    } else {
      if (to.meta.auth) {
        history.push(availablePages.SIGN_IN.path, { from: from.location.pathname });
      }
    }

    const toPage = _.find(availablePages, page => page.path === toPath);
    dispatch(setPageBasics(toPage));

    next();
  };

  return (
    <GuardProvider guards={[requireLogin]} error={NotFoundView}>
      <Switch>
        <RouteWithLayout
          component={HomeView}
          exact
          layout={Main2Layout}
          path={availablePages.HOME.path}
          title={availablePages.HOME.title}
          meta={{ auth: availablePages.HOME.auth }}
        />
        <RouteWithLayout
          component={CourseDetailsView}
          exact
          layout={Main2Layout}
          path={availablePages.COURSE_DETAILS.path}
          title={availablePages.COURSE_DETAILS.title}
          meta={{ auth: availablePages.COURSE_DETAILS.auth }}
        />
        <RouteWithLayout
          component={CategoryCoursesView}
          exact
          layout={Main2Layout}
          path={availablePages.CATEGORY_COURSES.path}
          title={availablePages.CATEGORY_COURSES.title}
          meta={{ auth: availablePages.CATEGORY_COURSES.auth }}
        />
        <RouteWithLayout
          component={CourseSearchingView}
          exact
          layout={Main2Layout}
          path={availablePages.COURSE_SEARCHING.path}
          title={availablePages.COURSE_SEARCHING.title}
          meta={{ auth: availablePages.COURSE_SEARCHING.auth }}
        />
        {authUser && _.filter(availablePages, page => page.auth && page.role === authUser.role)
          .map(page => (
            <RouteWithLayout
              key={page._id}
              component={page.component}
              exact
              layout={MainLayout}
              path={page.path}
              title={page.title}
              meta={{ auth: page.auth }}
            />
          ))}
        <RouteWithLayout
          component={ProfileView}
          exact
          layout={MainLayout}
          path={availablePages.PROFILE.path}
          title={availablePages.PROFILE.title}
          meta={{ auth: availablePages.PROFILE.auth }}
        />
        <RouteWithLayout
          component={SignUpView}
          exact
          layout={MinimalLayout}
          path={availablePages.SIGN_UP.path}
          title={availablePages.SIGN_UP.title}
          meta={{ auth: availablePages.SIGN_UP.auth }}
        />
        <RouteWithLayout
          component={SignInView}
          exact
          layout={MinimalLayout}
          path={availablePages.SIGN_IN.path}
          title={availablePages.SIGN_IN.title}
          meta={{ auth: availablePages.SIGN_IN.auth }}
        />
        <RouteWithLayout
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          title={availablePages.NOT_FOUND.title}
          meta={{ auth: availablePages.NOT_FOUND.auth }}
        />
        <Redirect to={availablePages.NOT_FOUND.path} />
      </Switch>
    </GuardProvider>
  );
};

export default Routes;
