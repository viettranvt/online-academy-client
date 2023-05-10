import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { studentApi } from 'api';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Course from 'components/Course/Course';
import CourseListEmpty from 'components/CourseListEmpty/CourseListEmpty';
import CourseListLoading from 'components/CourseListLoading/CourseListLoading';
import { apiMessage } from 'constants/api-message.constant';
import { availablePages } from 'constants/global.constant';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { showNotification } from 'redux/actions/app.action';
import { setPageBasics } from 'redux/actions/page.action';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(4),
    width: '100%'
  },
  btnLoadMoreCourse: {
    ...theme.palette.primary.gradient
  }
}));

const RegistrationCourses = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const limit = 8;

  const pageBasics = useSelector(state => ({
    ...state.page.basics
  }), shallowEqual);

  const [registrationList, setRegistrationList] = useState([]);
  const [registrationListPage, setRegistrationListPage] = useState(1);
  const [registrationListLoading, setRegistrationListLoading] = useState(true);

  const [disableBtnLoadMoreCourse, setDisableBtnLoadMoreCourse] = useState(false);
  const [btnLoadMoreCourseLoading, setBtnLoadMoreCourseLoading] = useState(false);

  useEffect(() => {
    const getRegistrations = async () => {
      setDisableBtnLoadMoreCourse(true);
      setBtnLoadMoreCourseLoading(true);
      try {
        const res = await studentApi.getRegistrations(registrationListPage, limit);
        const courses = res.data.entries.map(item => ({
          ...item.course,
          href: availablePages.COURSE_DETAILS.path.replace(':courseId', item.course._id)
        }));

        const newCourseList = [...registrationList, ...courses];
        setRegistrationList(newCourseList);

        const { totalItems } = res.data.meta;
        dispatch(setPageBasics({ ...pageBasics, title: `${availablePages.REGISTRATION_COURSES.title} (${totalItems})` }));

        if (newCourseList.length < totalItems) {
          setDisableBtnLoadMoreCourse(false);
        }

        setRegistrationListLoading(false);
        setBtnLoadMoreCourseLoading(false);
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
          setRegistrationListLoading(false);
          setBtnLoadMoreCourseLoading(false);
        }
      }
    }

    getRegistrations();
  }, [registrationListPage])

  const handleClickBtnLoadMoreCourse = () => {
    const newPage = registrationListPage + 1;
    setRegistrationListPage(newPage);
  }

  return (
    <div className={classes.root}>
      {registrationListLoading && <CourseListLoading />}
      {!registrationListLoading && registrationList.length === 0 && <CourseListEmpty />}
      {!registrationListLoading && registrationList.length > 0 && (
        <div>
          <Box display="flex" flexWrap="wrap" m={-1}>
            {registrationList.map((c, i) => (
              <Box key={c._id} m={1} className="animate__animated animate__zoomIn" style={{ animationDelay: `${0.1 * i}s` }}>
                <Course data={c} type="minimal" />
              </Box>
            ))}
          </Box>
          <Box mt={2}>
            <ButtonWithLoading
              fullWidth
              progressColor="#fff"
              text="Xem thêm khóa học"
              className={classes.btnLoadMoreCourse}
              variant="contained"
              size="large"
              color="primary"
              onClick={handleClickBtnLoadMoreCourse}
              disabled={disableBtnLoadMoreCourse}
              loading={btnLoadMoreCourseLoading}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default RegistrationCourses;
