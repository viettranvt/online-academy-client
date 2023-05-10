import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { courseApi } from 'api';
import clsx from 'clsx';
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

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(4),
    width: '100%'
  },
  btnLoadMoreCourse: {
    ...theme.palette.primary.gradient
  },
  btnCategory: {
    background: theme.palette.background.btnCategory,
    borderRadius: '1.5rem',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    transition: '.1s ease all',
  },
  btnCategory__active: {
    background: theme.palette.secondary.main,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
}));

const Courses = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const limit = 8;

  const parentScrollbarUtils = useContext(ScrollbarContext);

  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  const { categoryClusterList } = appState;

  const pageBasics = useSelector(state => ({
    ...state.page.basics
  }), shallowEqual);

  const [courseList, setCourseList] = useState([]);
  const [courseListPage, setCourseListPage] = useState(1);
  const [courseListLoading, setCourseListLoading] = useState(true);
  const [disableBtnLoadMoreCourse, setDisableBtnLoadMoreCourse] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryCourseListLoading, setCategoryCourseListLoading] = useState(false);
  const [btnLoadMoreCourseLoading, setBtnLoadMoreCourseLoading] = useState(false);

  const getAllCourses = async (page) => {
    setDisableBtnLoadMoreCourse(true);
    setBtnLoadMoreCourseLoading(true);
    try {
      let params = { page, limit };
      if (selectedCategory) {
        params.categoryId = selectedCategory._id;
      }

      const res = await courseApi.getAll(params);
      const courses = res.data.entries.map(item => ({
        ...item,
        href: availablePages.COURSE_DETAILS.path.replace(':courseId', item._id)
      }));

      const newCourseList = page === 1 ? courses : courseList.concat(courses);
      setCourseList(newCourseList);

      const { totalItems } = res.data.meta;
      dispatch(setPageBasics({ ...pageBasics, title: `${availablePages.COURSES.title} (${totalItems})` }));

      if (newCourseList.length < totalItems) {
        setDisableBtnLoadMoreCourse(false);
      }

      setCourseListLoading(false);
      setCategoryCourseListLoading(false);
      setBtnLoadMoreCourseLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setCourseListLoading(false);
        setCategoryCourseListLoading(false);
        setBtnLoadMoreCourseLoading(false);
      }
    }
  }


  useEffect(() => {
    const newCategoryList = categoryClusterList.reduce((acc, cur) => acc.concat(cur.categories), []);
    setCategoryList(newCategoryList);
  }, [categoryClusterList]);

  useEffect(() => {
    getAllCourses(courseListPage);
  }, [courseListPage]);

  useEffect(() => {
    setCategoryCourseListLoading(true);

    if (courseListPage === 1) {
      getAllCourses(1);
    } else {
      setCourseListPage(1);
    }

    parentScrollbarUtils.scrollTop(0);
  }, [selectedCategory]);

  const handleClickBtnLoadMoreCourse = () => {
    const newPage = courseListPage + 1;
    setCourseListPage(newPage);
  }

  const handleClickBtnCategory = (category) => {
    setSelectedCategory(category);
  }

  return (
    <div className={classes.root}>
      {courseListLoading && <CourseListLoading />}
      {!courseListLoading && (
        <Box mt={-1}>
          <Box display="flex" flexWrap="wrap">
            <Box mr={1}>
              <Button
                size="small"
                className={clsx(classes.btnCategory, {
                  [classes.btnCategory__active]: !selectedCategory
                })}
                onClick={() => handleClickBtnCategory(null)}
              >
                Mọi lĩnh vực
              </Button>
            </Box>
            {categoryList.map((c, i) => (
              <Box mr={1} key={i}>
                <Button
                  size="small"
                  className={clsx(classes.btnCategory, {
                    [classes.btnCategory__active]: selectedCategory && selectedCategory._id === c._id
                  })}
                  onClick={() => handleClickBtnCategory(c)}
                >
                  {c.name}
                </Button>
              </Box>
            ))}
          </Box>
          {!categoryCourseListLoading ? (
            <div>
              {courseList.length > 0 ? (
                <div>
                  <Box mt={1} display="flex" flexWrap="wrap" m={-1}>
                    {courseList.map((c, i) => (
                      <Box key={c._id} m={1} className="animate__animated animate__zoomIn" style={{ animationDelay: `${0.1 * i}s` }}>
                        <Course data={c} type="minimal" />
                      </Box>
                    ))}
                  </Box>
                  <Box mt={2}>
                    <ButtonWithLoading
                      fullWidth
                      className={classes.btnLoadMoreCourse}
                      text="Xem thêm khóa học"
                      variant="contained"
                      size="large"
                      color="primary"
                      progressColor="#fff"
                      loading={btnLoadMoreCourseLoading}
                      disabled={disableBtnLoadMoreCourse}
                      onClick={handleClickBtnLoadMoreCourse}
                    />
                  </Box>
                </div>
              ) : (<CourseListEmpty />)}
            </div>
          ) : <CourseListLoading />}
        </Box>
      )}
    </div >
  );
};

export default Courses;
