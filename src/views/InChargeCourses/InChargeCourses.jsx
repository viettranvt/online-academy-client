import { Box, Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { lecturerApi } from 'api';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Course from 'components/Course/Course';
import CourseListEmpty from 'components/CourseListEmpty/CourseListEmpty';
import CourseListLoading from 'components/CourseListLoading/CourseListLoading';
import { apiMessage } from 'constants/api-message.constant';
import { availablePages } from 'constants/global.constant';
import ScrollbarContext from 'contexts/ScrollbarContext';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { showNotification } from 'redux/actions/app.action';
import { setPageBasics } from 'redux/actions/page.action';
import AddCourse from './components/AddCourse/AddCourse';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 5,
    padding: theme.spacing(4),
    paddingTop: theme.spacing(2),
    width: '100%'
  },
  btnAddCourse: {
    position: 'absolute',
    zIndex: 10,
    right: '3.5%',
    top: '1.5625rem',
    ...theme.palette.primary.gradient
  },
  btnLoadMoreCourse: {
    ...theme.palette.primary.gradient
  }
}));

const InChargeCourses = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const limit = 8;

  const parentScrollbarUtils = useContext(ScrollbarContext);

  const pageBasics = useSelector(state => ({
    ...state.page.basics
  }), shallowEqual);

  const [openAddCouse, setOpenAddCourse] = useState(false);

  const [lecturerCourseList, setLecturerCourseList] = useState([]);
  const [lecturerCourseListPage, setLecturerCourseListPage] = useState(1);
  const [lecturerCourseListLoading, setLecturerCourseListLoading] = useState(true);

  const [disableBtnLoadMoreCourse, setDisableBtnLoadMoreCourse] = useState(false);
  const [btnLoadMoreCourseLoading, setBtnLoadMoreCourseLoading] = useState(false);

  const getAllLecturerCourses = async (page) => {
    setDisableBtnLoadMoreCourse(true);
    setBtnLoadMoreCourseLoading(true);
    try {
      const res = await lecturerApi.getCourses(page, limit);
      const lecturerCourses = res.data.entries.map(item => ({
        ...item,
        href: availablePages.COURSE_DETAILS.path.replace(':courseId', item._id)
      }));

      const newLecturerCourseList = page === 1 ? lecturerCourses : lecturerCourseList.concat(lecturerCourses);
      setLecturerCourseList(newLecturerCourseList);

      const { totalItems } = res.data.meta;
      dispatch(setPageBasics({ ...pageBasics, title: `${availablePages.IN_CHARGE_COURSES.title} (${totalItems})` }));

      if (newLecturerCourseList.length < totalItems) {
        setDisableBtnLoadMoreCourse(false);
      }

      setLecturerCourseListLoading(false);
      setBtnLoadMoreCourseLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setLecturerCourseListLoading(false);
        setBtnLoadMoreCourseLoading(false);
      }
    }
  }

  const toggleAddCourse = (event, open, message) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (message === apiMessage.COURSE_ADDED_SUCCESSFULLY) {
      setLecturerCourseListPage(1);
      getAllLecturerCourses(1);
      parentScrollbarUtils.scrollTop(0);
    }

    setOpenAddCourse(open);
  };

  useEffect(() => {
    getAllLecturerCourses(lecturerCourseListPage);
  }, [lecturerCourseListPage]);

  const handleClickBtnLoadMoreCourse = () => {
    const newPage = lecturerCourseListPage + 1;
    setLecturerCourseListPage(newPage);
  }

  return (
    <div className={classes.root}>
      {lecturerCourseListLoading && <CourseListLoading />}
      {!lecturerCourseListLoading && (
        <div>
          <AddCourse
            open={openAddCouse}
            onClose={(e, message) => toggleAddCourse(e, false, message)}
          />
          <Tooltip title="Đăng khóa học mới" className="animate__animated animate__bounceIn">
            <Fab size="large" color="primary" aria-label="add" className={classes.btnAddCourse} onClick={(e) => toggleAddCourse(e, true)}>
              <AddIcon fontSize="large" />
            </Fab>
          </Tooltip>
          <Box display="flex" flexWrap="wrap" m={-1} pt={2}>
            {lecturerCourseList.map((c, i) => (
              <Box key={c._id} m={1} className="animate__animated animate__zoomIn" style={{ animationDelay: `${0.1 * i}s` }}>
                <Course data={c} type="minimal" />
              </Box>
            ))}
          </Box>
          {lecturerCourseList.length === 0 && <CourseListEmpty />}
          {lecturerCourseList.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default InChargeCourses;