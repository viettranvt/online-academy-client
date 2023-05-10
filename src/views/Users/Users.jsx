import { AppBar, Box, Fab, GridList, GridListTile, Tab, Tabs, Tooltip } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/styles';
import { studentApi } from 'api';
import lecturerApi from 'api/lecturer.api';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import CourseListLoading from 'components/CourseListLoading/CourseListLoading';
import Lecturer from 'components/Lecturer/Lecturer';
import Student from 'components/Student/Student';
import { apiMessage } from 'constants/api-message.constant';
import { availablePages } from 'constants/global.constant';
import ScrollbarContext from 'contexts/ScrollbarContext';
import React, { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { showNotification } from 'redux/actions/app.action';
import { setPageBasics, setPageLoading } from 'redux/actions/page.action';
import AddLecturer from './components/AddLecturer/AddLecturer';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '35rem',
    width: '100%',
    overflow: 'hidden',
    paddingTop: theme.spacing(4)
  },
  tabs: {
    boxShadow: 'none',
    backgroundColor: theme.palette.card.backgroundColor,
    color: theme.palette.text.primary
  },
  tabIcon: {
    color: theme.palette.icon
  },
  btnAddLecturerContainer: {
    position: 'absolute',
    zIndex: 10,
    right: '5%',
    top: '-1.875rem'
  },
  btnAddLecturer: {
    ...theme.palette.primary.gradient
  },
  btnLoadMore: {
    ...theme.palette.primary.gradient
  }
}));

const Users = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const limit = 12;

  const parentScrollbarUtils = useContext(ScrollbarContext);

  const pageBasics = useSelector(state => ({
    ...state.page.basics
  }), shallowEqual);

  const [tabValue, setTabValue] = useState(0);

  const [studentList, setStudentList] = useState([]);
  const [studentListLoading, setStudentListLoading] = useState(true);
  const [studentListPage, setStudentListPage] = useState(1);
  const [studentListTotalItems, setStudentListTotalItems] = useState(0);
  const [disableBtnLoadMoreStudent, setDisableBtnLoadMoreStudent] = useState(false);
  const [btnLoadMoreStudentLoading, setBtnLoadMoreStudentLoading] = useState(false);

  const [lecturerList, setLecturerList] = useState([]);
  const [lecturerListLoading, setLecturerListLoading] = useState(true);
  const [lecturerListPage, setLecturerListPage] = useState(1);
  const [lecturerListTotalItems, setLecturerListTotalItems] = useState(0);
  const [disableBtnLoadMoreLecturer, setDisableBtnLoadMoreLecturer] = useState(false);
  const [btnLoadMoreLecturerLoading, setBtnLoadMoreLecturerLoading] = useState(false);

  const [openAddLecturer, setOpenAddLecturer] = useState(false);

  const getAllStudents = async (page) => {
    setDisableBtnLoadMoreStudent(true);
    setBtnLoadMoreStudentLoading(true);
    try {
      const res = await studentApi.getAll(page, limit);
      const students = res.data.entries;
      const newStudentList = page === 1 ? students : studentList.concat(students);
      setStudentList(newStudentList);

      const { totalItems } = res.data.meta;
      setStudentListTotalItems(totalItems);

      if (newStudentList.length < totalItems) {
        setDisableBtnLoadMoreStudent(false);
      }

      setStudentListLoading(false);
      setBtnLoadMoreStudentLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setStudentListLoading(false);
        setBtnLoadMoreStudentLoading(false);
      }
    }
  };

  const getAllLecturers = async (page) => {
    setDisableBtnLoadMoreLecturer(true);
    setBtnLoadMoreLecturerLoading(true);
    try {
      const res = await lecturerApi.getAll(page, limit);
      const lecturers = res.data.entries;
      const newLecturerList = page === 1 ? lecturers : lecturerList.concat(lecturers);
      setLecturerList(newLecturerList);

      const { totalItems } = res.data.meta;
      setLecturerListTotalItems(totalItems);

      if (newLecturerList.length < totalItems) {
        setDisableBtnLoadMoreLecturer(false);
      }

      setLecturerListLoading(false);
      setBtnLoadMoreLecturerLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setLecturerListLoading(false);
        setBtnLoadMoreLecturerLoading(false);
      }
    }
  };

  const addLecturer = async (data) => {
    dispatch(setPageLoading(true));
    try {
      const res = await lecturerApi.add(data);
      setLecturerListPage(1);
      getAllLecturers(1);
      parentScrollbarUtils.scrollTop(0);
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  };

  useEffect(() => {
    const total = studentListTotalItems + lecturerListTotalItems;
    dispatch(setPageBasics({ ...pageBasics, title: `${availablePages.USERS.title} (${total})` }));
  }, [studentListTotalItems, lecturerListTotalItems]);

  useEffect(() => {
    getAllStudents(studentListPage);
  }, [studentListPage]);

  useEffect(() => {
    getAllLecturers(lecturerListPage);
  }, [lecturerListPage]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickBtnLoadMore = (type) => {
    switch (type) {
      case 1:
        const newPage = studentListPage + 1;
        setStudentListPage(newPage);
        break;
      case 2:
        const newLecturerPage = lecturerListPage + 1;
        setLecturerListPage(newLecturerPage);
        break;

      default:
        break;
    }
  }

  const handleClickBtnAddLecturer = () => {
    setOpenAddLecturer(true);
  }

  const handleCloseAddLecturer = (accepted, data) => {
    setOpenAddLecturer(false);

    if (accepted) {
      addLecturer(data);
    }
  }

  const handleRemoveUser = (type, userId) => {
    switch (type) {
      case 1:
        setStudentListPage(1);
        getAllStudents(1);
        parentScrollbarUtils.scrollTop(0);
        break;
      case 2:
        setLecturerListPage(1);
        getAllLecturers(1);
        parentScrollbarUtils.scrollTop(0);
        break;

      default:
        break;
    }
  }

  const handleBlockUser = (type, userId) => {
    switch (type) {
      case 1:
        const newStudentList = studentList;
        const index = newStudentList.findIndex(s => s._id === userId);

        if (index >= 0) {
          newStudentList[index].isBlocked = true;
          setStudentList(newStudentList);
        }

        break;
      case 2:
        const newLecturerList = lecturerList;
        const indexLecturerList = newLecturerList.findIndex(l => l._id === userId);

        if (indexLecturerList >= 0) {
          newLecturerList[indexLecturerList].isBlocked = true;
          setLecturerList(newLecturerList);
        }

        break;

      default:
        break;
    }
  }

  const handleUnblockUser = (type, userId) => {
    switch (type) {
      case 1:
        const newStudentList = studentList;
        const index = newStudentList.findIndex(s => s._id === userId);

        if (index >= 0) {
          newStudentList[index].isBlocked = false;
          setStudentList(newStudentList);
        }

        break;
      case 2:
        const newLecturerList = lecturerList;
        const indexLecturerList = newLecturerList.findIndex(s => s._id === userId);

        if (indexLecturerList >= 0) {
          newLecturerList[indexLecturerList].isBlocked = false;
          setLecturerList(newLecturerList);
        }

        break;

      default:
        break;
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabs} color="primary">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab
            icon={<PersonIcon className={classes.tabIcon} />}
            label={
              <span>
                Học viên (<NumberFormat value={studentListTotalItems} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />)
              </span>
            }
            {...a11yProps(0)}
          />
          <Tab
            icon={<FaceIcon className={classes.tabIcon} />}
            label={
              <span>
                Giảng viên (<NumberFormat value={lecturerListTotalItems} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />)
              </span>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>

      {tabValue === 0 && (
        <Box p={4}>
          {studentListLoading && <CourseListLoading />}
          {!studentListLoading && studentList.length > 0 && (
            <div>
              <GridList cellHeight="auto" cols={3}>
                {studentList.map((s, i) => (
                  <GridListTile key={s._id}>
                    <Box m={1} className="animate__animated animate__fadeIn" style={{ animationDelay: `${0.05 * i}s` }}>
                      <Student
                        data={s}
                        onRemove={(studentId) => handleRemoveUser(1, studentId)}
                        onBlock={(studentId) => handleBlockUser(1, studentId)}
                        onUnblock={(studentId) => handleUnblockUser(1, studentId)}
                      />
                    </Box>
                  </GridListTile>
                ))}
              </GridList>
              <Box px={1} pt={2}>
                <ButtonWithLoading
                  fullWidth
                  className={classes.btnLoadMore}
                  text="Xem thêm học viên"
                  variant="contained"
                  size="large"
                  color="primary"
                  progressColor="#fff"
                  loading={btnLoadMoreStudentLoading}
                  onClick={() => handleClickBtnLoadMore(1)}
                  disabled={disableBtnLoadMoreStudent}
                />
              </Box>
            </div>

          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box p={4} position="relative">
          {lecturerListLoading && <CourseListLoading />}
          {!lecturerListLoading && lecturerList.length > 0 && (
            <div>
              <AddLecturer open={openAddLecturer} onClose={handleCloseAddLecturer} />
              <Box className={`${classes.btnAddLecturerContainer} animate__animated animate__bounceIn`}>
                <Tooltip title="Thêm giảng viên mới">
                  <Fab size="large" color="primary" aria-label="add" className={classes.btnAddLecturer} onClick={handleClickBtnAddLecturer}>
                    <PersonAddIcon fontSize="large" />
                  </Fab>
                </Tooltip>
              </Box>
              <GridList cellHeight="auto" cols={3}>
                {lecturerList.map((s, i) => (
                  <GridListTile key={s._id}>
                    <Box m={1} className="animate__animated animate__fadeIn" style={{ animationDelay: `${0.05 * i}s` }}>
                      <Lecturer
                        data={s}
                        onRemove={(lecturerId) => handleRemoveUser(2, lecturerId)}
                        onBlock={(lecturerId) => handleBlockUser(2, lecturerId)}
                        onUnblock={(lecturerId) => handleUnblockUser(2, lecturerId)}
                      />
                    </Box>
                  </GridListTile>
                ))}
              </GridList>
              <Box px={1} pt={2}>
                <ButtonWithLoading
                  fullWidth
                  className={classes.btnLoadMore}
                  text="Xem thêm giảng viên"
                  variant="contained"
                  size="large"
                  color="primary"
                  progressColor="#fff"
                  loading={btnLoadMoreLecturerLoading}
                  onClick={() => handleClickBtnLoadMore(2)}
                  disabled={disableBtnLoadMoreLecturer}
                />
              </Box>
            </div>
          )}
        </Box>
      )}

    </div>
  );
};

export default Users;
