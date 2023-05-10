import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/styles';
import { categoryApi, categoryClusterApi } from 'api';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import CourseListLoading from 'components/CourseListLoading/CourseListLoading';
import { apiMessage } from 'constants/api-message.constant';
import { availablePages } from 'constants/global.constant';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { setAppCategoryClusterList, showNotification } from 'redux/actions/app.action';
import { AddCategory, AddCategoryCluster, CategoryDetails, CategoryMenu } from './components';
import UpdateCategory from './components/UpdateCategory/UpdateCategory';
import UpdateCategoryCluster from './components/UpdateCategoryCluster/UpdateCategoryCluster';
import { setPageLoading } from 'redux/actions/page.action';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '33rem',
    width: '100%'
  },
  categoryCluster: {
    backgroundColor: theme.palette.background.course,
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    borderRadius: 5,
    marginBottom: theme.spacing(1)
  },
  categoryList: {
    width: '100%',
    backgroundColor: theme.palette.background.addCategory,
    borderRadius: 5,
    boxShadow: 'none'
  },
  categoryList__container: {
    // maxHeight: '18.75rem',
    // overflow: 'scroll'
  },
  icon: {
    color: theme.palette.icon
  },
  btnLoadMoreCategoryCluster: {
    ...theme.palette.primary.gradient
  },
  emptyList: {
    height: '26.25rem'
  },
  emptyListIcon: {
    fontSize: '4.375rem',
    color: theme.palette.icon
  }
}));

const AddCategoryClusterButton = ({
  handleClickBtnAddCategoryCluster,
  openAddCategoryCluster,
  handleCloseAddCategoryCluster
}) => (
    <div>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickBtnAddCategoryCluster}
      >
        Thêm nhóm lĩnh vực
      </Button>
      <AddCategoryCluster
        open={openAddCategoryCluster}
        onClose={handleCloseAddCategoryCluster}
      />
    </div>
  )

export default function Categories() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const limit = 5;

  const appState = useSelector(state => ({
    ...state.app
  }), shallowEqual);

  const [expandedCategoryClusterIndex, setExpandedCategoryClusterIndex] = useState(null);
  const [hoveredCategoryClusterIndex, setHoveredCategoryClusterIndex] = useState(null);
  const [openAddCategoryCluster, setOpenAddCategoryCluster] = useState(false);
  const [openUpdateCategoryCluster, setOpenUpdateCategoryCluster] = useState(false);
  const [openRemoveCategoryClusterConfirmDialog, setOpenRemoveCategoryClusterConfirmDialog] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategoryDetails, setOpenCategoryDetails] = useState(false);
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
  const [openRemoveCategoryConfirmDialog, setOpenRemoveCategoryConfirmDialog] = useState(false);

  const [categoryClusterList, setCategoryClusterList] = useState([]);
  const [categoryClusterListLoading, setCategoryClusterListLoading] = useState(true);
  const [categoryClusterListPage, setCategoryClusterListPage] = useState(1);
  const [disableBtnLoadMoreCategoryCluster, setDisableBtnLoadMoreCategoryCluster] = useState(false);
  const [btnLoadMoreCategoryClusterLoading, setBtnLoadMoreCategoryClusterLoading] = useState(false);

  const getAllCategoryClusters = async (page) => {
    setDisableBtnLoadMoreCategoryCluster(true);
    setBtnLoadMoreCategoryClusterLoading(true);
    try {
      const res = await categoryClusterApi.getAll(page, limit);
      const { entries } = res.data;

      const newCategoryClusterList = page === 1 ? entries : categoryClusterList.concat(entries);
      for (let cc of newCategoryClusterList) {
        cc.categories = cc.categories.map(c => ({
          ...c,
          href: availablePages.CATEGORY_COURSES.path.replace(':categoryId', c._id)
        }));
      }
      setCategoryClusterList(newCategoryClusterList);

      if (newCategoryClusterList.length < res.data.meta.totalItems) {
        setDisableBtnLoadMoreCategoryCluster(false);
      }

      setCategoryClusterListLoading(false);
      setBtnLoadMoreCategoryClusterLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        setCategoryClusterListLoading(false);
        setBtnLoadMoreCategoryClusterLoading(false);
      }
    }
  }

  useEffect(() => {
    getAllCategoryClusters(categoryClusterListPage);
  }, [categoryClusterListPage]);

  const handleClickCategoryCluster = (index) => {
    if (index === expandedCategoryClusterIndex)
      setExpandedCategoryClusterIndex(null);
    else
      setExpandedCategoryClusterIndex(index);
  }

  const handleClickCategory = data => {
    setSelectedCategory(data);
  }

  const handleClickCategoryMenu = (index) => {
    switch (index) {
      case 1:
        setOpenCategoryDetails(true);
        break;

      case 2:
        setOpenUpdateCategory(true);
        break;

      case 3:
        setOpenRemoveCategoryConfirmDialog(true);
        break;

      default:
        break;
    }
  }

  const handleCloseCategoryDetails = () => {
    setOpenCategoryDetails(false);
  }

  const handleCloseUpdateCategory = async (accepted, data) => {
    setOpenUpdateCategory(false);
    if (!accepted)
      return;

    dispatch(setPageLoading(true));
    const selectedCategoryCluster = categoryClusterList[expandedCategoryClusterIndex];
    try {
      const res = await categoryApi.update(selectedCategory._id, data);
      let index = selectedCategoryCluster.categories
        .findIndex(c => c._id === selectedCategory._id);

      const updatedCategory = res.data.category;
      if (index >= 0) {
        const newCategoryClusterList = categoryClusterList;
        newCategoryClusterList[expandedCategoryClusterIndex].categories[index] = { ...selectedCategory, ...updatedCategory };
        setCategoryClusterList(newCategoryClusterList);
      }

      const newAppCategoryClusterList = appState.categoryClusterList;
      const appCategoryClusterIndex = newAppCategoryClusterList.findIndex(cc => cc._id === selectedCategoryCluster._id);
      if (appCategoryClusterIndex >= 0) {
        const appCategoryIndexToUpdate = newAppCategoryClusterList[appCategoryClusterIndex].categories
          .findIndex(c => c._id === updatedCategory._id);

        if (appCategoryIndexToUpdate >= 0) {
          newAppCategoryClusterList[appCategoryClusterIndex].categories[appCategoryIndexToUpdate] = {
            ...newAppCategoryClusterList[appCategoryClusterIndex].categories[appCategoryIndexToUpdate],
            ...updatedCategory
          };
          dispatch(setAppCategoryClusterList(newAppCategoryClusterList));
        }
      }

      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const handleCloseUpdateCategoryCluster = async (accepted, data) => {
    setOpenUpdateCategoryCluster(false);
    if (!accepted)
      return;

    dispatch(setPageLoading(true));
    const categoryClusterToUpdate = categoryClusterList[hoveredCategoryClusterIndex];
    try {
      const res = await categoryClusterApi.update(categoryClusterToUpdate._id, data);
      const updatedCategoryCluster = res.data.categoryCluster;
      const newCategoryClusterList = categoryClusterList;
      newCategoryClusterList[hoveredCategoryClusterIndex] = { ...categoryClusterToUpdate, ...updatedCategoryCluster };

      const newAppCategoryClusterList = appState.categoryClusterList;
      const appCategoryClusterIndexToUpdate = newAppCategoryClusterList.findIndex(cc => cc._id === updatedCategoryCluster._id);
      if (appCategoryClusterIndexToUpdate >= 0) {
        newAppCategoryClusterList[appCategoryClusterIndexToUpdate] = {
          ...newAppCategoryClusterList[appCategoryClusterIndexToUpdate],
          ...updatedCategoryCluster
        };
        dispatch(setAppCategoryClusterList(newAppCategoryClusterList));
      }

      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const updateSelectedCategoryCluster = () => {
    const newAppCategoryClusterList = appState.categoryClusterList.map(cc => {
      if (cc._id === categoryClusterList[expandedCategoryClusterIndex]._id)
        return { ...cc, categories: categoryClusterList[expandedCategoryClusterIndex].categories }

      return cc;
    });
    dispatch(setAppCategoryClusterList(newAppCategoryClusterList));
  }

  const handleCloseRemoveCategoryConfirmDialog = async (accepted) => {
    setOpenRemoveCategoryConfirmDialog(false);
    if (!accepted)
      return;

    dispatch(setPageLoading(true));
    try {
      const res = await categoryApi.delete(selectedCategory._id);
      categoryClusterList[expandedCategoryClusterIndex].categories = categoryClusterList[expandedCategoryClusterIndex].categories
        .filter(c => c._id !== selectedCategory._id);
      updateSelectedCategoryCluster();
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const handleCloseRemoveCategoryClusterConfirmDialog = async (accepted) => {
    setOpenRemoveCategoryClusterConfirmDialog(false);
    if (!accepted)
      return;

    dispatch(setPageLoading(true));
    const categoryClusterToRemove = categoryClusterList[hoveredCategoryClusterIndex];
    try {
      const res = await categoryClusterApi.delete(categoryClusterToRemove._id);

      if (categoryClusterListPage !== 1) {
        getAllCategoryClusters(1);
        setCategoryClusterListPage(1);
      } else {
        getAllCategoryClusters(1);
      }

      const newAppCategoryClusterList = appState.categoryClusterList.filter(cc => cc._id !== categoryClusterToRemove._id);
      dispatch(setAppCategoryClusterList(newAppCategoryClusterList));

      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const handleClickBtnAddCategoryCluster = () => {
    setOpenAddCategoryCluster(true);
  }

  const handleCloseAddCategoryCluster = async (accepted, data) => {
    setOpenAddCategoryCluster(false);
    if (!accepted) {
      return;
    }

    dispatch(setPageLoading(true));
    try {
      const res = await categoryClusterApi.add(data);
      const newCategoryCluster = { ...res.data.categoryCluster, categories: [] };
      const newCategoryClusterList = [newCategoryCluster, ...categoryClusterList];
      setCategoryClusterList(newCategoryClusterList);
      dispatch(setAppCategoryClusterList([newCategoryCluster, ...appState.categoryClusterList]));
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
      dispatch(setPageLoading(false));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
        dispatch(setPageLoading(false));
      }
    }
  }

  const handleSubmitAddCategory = async (data) => {
    const categoryClusterId = categoryClusterList[expandedCategoryClusterIndex]._id;
    const params = {
      ...data,
      categoryClusterId: categoryClusterId
    };

    try {
      const res = await categoryApi.add(params);
      let { category } = res.data;
      category.href = availablePages.CATEGORY_COURSES.path.replace(':categoryId', category._id);
      categoryClusterList[expandedCategoryClusterIndex].categories.unshift(category);
      updateSelectedCategoryCluster();
      dispatch(showNotification('success', apiMessage[res.messages[0]]));
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  }

  return (
    <Box p={4} className={classes.root}>
      {categoryClusterListLoading && <CourseListLoading />}
      {!categoryClusterListLoading && categoryClusterList.length === 0 && (
        <div>
          <Box mb={3}>
            <AddCategoryClusterButton
              handleClickBtnAddCategoryCluster={handleClickBtnAddCategoryCluster}
              openAddCategoryCluster={openAddCategoryCluster}
              handleCloseAddCategoryCluster={handleCloseAddCategoryCluster}
            />
          </Box>
          <Box className={classes.emptyList} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box mb={1}>
              <CategoryIcon className={classes.emptyListIcon} />
            </Box>
            <Typography variant="subtitle2">Chưa có nhóm lĩnh vực nào.</Typography>
          </Box>
        </div>
      )}
      {!categoryClusterListLoading && categoryClusterList.length > 0 && (
        <div>
          <Box mb={3}>
            <AddCategoryClusterButton
              handleClickBtnAddCategoryCluster={handleClickBtnAddCategoryCluster}
              openAddCategoryCluster={openAddCategoryCluster}
              handleCloseAddCategoryCluster={handleCloseAddCategoryCluster}
            />
          </Box>
          {categoryClusterList.map((cc, i) => (
            <Accordion
              key={i}
              className={`${classes.categoryCluster}`}
              style={{ animationDelay: `${0.1 * i}s` }}
              expanded={i === expandedCategoryClusterIndex}
              onMouseOver={() => setHoveredCategoryClusterIndex(i)}
              onMouseLeave={() => setHoveredCategoryClusterIndex(null)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={classes.icon} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  style={{ width: '100%' }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    onClick={() => handleClickCategoryCluster(i)}
                    style={{ width: '100%' }}
                  >
                    <Typography variant="h5" gutterBottom><b>{cc.name}</b></Typography>
                    <Typography variant="body2">
                      <NumberFormat value={cc.categories.length} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' lĩnh vực'} />
                    </Typography>
                  </Box>
                  {hoveredCategoryClusterIndex === i && (
                    <Box display="flex">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton className={classes.icon} onClick={() => setOpenUpdateCategoryCluster(true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa" onClick={() => setOpenRemoveCategoryClusterConfirmDialog(true)}>
                        <IconButton className={classes.icon}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <UpdateCategoryCluster
                        categoryCluster={categoryClusterList[i]}
                        open={openUpdateCategoryCluster}
                        onClose={handleCloseUpdateCategoryCluster}
                      />
                      <ConfirmDialog
                        title="Xác nhận"
                        content="Bạn thật sự muốn xóa nhóm lĩnh vực này?"
                        open={openRemoveCategoryClusterConfirmDialog}
                        onClose={handleCloseRemoveCategoryClusterConfirmDialog}
                      />
                    </Box>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" style={{ width: '100%' }}>
                  <Box mb={2}>
                    <AddCategory onSubmit={handleSubmitAddCategory} />
                  </Box>
                  <List className={classes.categoryList}>
                    <PerfectScrollbar className={classes.categoryList__container}>
                      {cc.categories.map(c => (
                        <ListItem key={c._id} onClick={() => handleClickCategory({ ...c, categoryCluster: { name: cc.name } })}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                            <ListItemText
                              primary={(
                                <Typography variant="body1" gutterBottom>{c.name}</Typography>
                              )}
                              secondary={(
                                <NumberFormat value={c.numberOfCourses} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' khóa học'} />
                              )} />
                            <CategoryMenu onClickList={handleClickCategoryMenu} />
                          </Box>
                        </ListItem>
                      ))}

                      {cc.categories.length === 0 && (
                        <Box p={2}>
                          <Typography variant="body2">Chưa có lĩnh vực nào.</Typography>
                        </Box>

                      )}
                    </PerfectScrollbar>
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
          }

          <Box mt={2}>
            <ButtonWithLoading
              fullWidth
              className={classes.btnLoadMoreCategoryCluster}
              text="Xem thêm nhóm lĩnh vực"
              variant="contained"
              size="large"
              color="primary"
              progressColor="#fff"
              loading={btnLoadMoreCategoryClusterLoading}
              disabled={disableBtnLoadMoreCategoryCluster}
              onClick={() => setCategoryClusterListPage(categoryClusterListPage + 1)}
            />
          </Box>

          {selectedCategory && (
            <div>
              <CategoryDetails
                data={selectedCategory}
                open={openCategoryDetails}
                onClose={handleCloseCategoryDetails}
              />
              <UpdateCategory
                data={selectedCategory}
                open={openUpdateCategory}
                onClose={handleCloseUpdateCategory}
              />
              <ConfirmDialog
                title="Xác nhận"
                content="Bạn thật sự muốn xóa lĩnh vực này?"
                open={openRemoveCategoryConfirmDialog}
                onClose={handleCloseRemoveCategoryConfirmDialog}
              />
            </div>
          )}
        </div>
      )}
    </Box>
  )
}
