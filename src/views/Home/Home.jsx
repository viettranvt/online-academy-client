import { Avatar, Box, Button, ButtonBase, Grid, List, ListItem, Typography, Tooltip } from '@material-ui/core';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import SchoolIcon from '@material-ui/icons/School';
import StarIcon from '@material-ui/icons/Star';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/styles';
import { homeApi } from 'api';
import Course from 'components/Course/Course';
import CourseMultiCarousel from 'components/CourseMultiCarousel/CourseMultiCarousel';
import { apiMessage } from 'constants/api-message.constant';
import { APP_LOGO_IMAGE, APP_NAME, APP_SLOGAN, availablePages, STATUS } from 'constants/global.constant';
import React, { forwardRef, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { setLoading, showNotification } from 'redux/actions/app.action';
import { format } from 'timeago.js';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CategoryIcon from '@material-ui/icons/Category';
import BorderColorIcon from '@material-ui/icons/BorderColor';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  banner: {
    position: 'relative',
    height: '17rem'
  },
  bannerCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(4)
  },
  bannerText: {
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
  },
  bannerTitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 'bold',
    marginTop: theme.spacing(1)
  },
  bannerSubTitle: {
    marginTop: theme.spacing(1)
  },
  logoImage: {
    width: '4.5rem',
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(2),
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
  },
  main: {
    // position: 'absolute',
    position: 'relative',
    zIndex: 10,
    // top: '80%',
    left: '50%',
    transform: 'translate(-50%,0)',
    width: '85%',
    // padding: theme.spacing(5, 0)
    paddingBottom: theme.spacing(4)
  },
  featuredCourses: {
    padding: theme.spacing(4),
    ...theme.palette.card
  },
  featuredCourses__title: {
    color: theme.palette.text.primary
  },
  starIcon: {
    color: '#ffb600',
    marginBottom: theme.spacing(0.5)
  },
  featuredCoursesCarouselTitleIcon: {
    marginRight: theme.spacing(1)
  },
  featuredCoursesCarousel: {
    ...theme.palette.card,
    marginTop: theme.spacing(3),
    overflow: 'hidden',
    boxShadow: 'none'
  },
  featuredCoursesCarouselItem: {
    height: '30rem',
    position: 'relative'
  },
  featuredCoursesCarouselItemLegend: {
    textAlign: 'left !important',
    opacity: '1 !important',
    background: 'rgba(0,0,0,0.4) !important',
    backdropFilter: 'blur(6px)'
  },
  featuredCoursesCarouselItem__courseThumbnail: {
    width: '100%',
    height: '100%'
  },
  featuredCoursesCarouselItem__courseThumbnailCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 -14rem 6.25rem rgba(0, 0, 0, 0.6)'
  },
  featuredCoursesCarouselItem__ratingDetails: {
    margin: theme.spacing(1.5, 0)
  },
  featuredCoursesCarouselItem__price: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  },
  section: {
    marginTop: theme.spacing(2)
  },
  highestViewCourses: {
    ...theme.palette.card,
    padding: theme.spacing(4),
    ...theme.palette.primary.gradient
  },
  highestViewCourses__title: {
    color: theme.palette.primary.contrastText
  },
  highestViewCoursesCarousel: {
    marginTop: theme.spacing(3)
  },
  popularCategories: {
    position: 'relative',
    minHeight: '37.5rem',
    width: '100%',
    padding: theme.spacing(4, 0, 4, 0),
    ...theme.palette.card
  },
  popularCategories__title: {
    color: theme.palette.text.primary
  },
  popularCategories__item: {
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 4),
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: 'bold'
  },
  newCourses: {
    minHeight: '37.5rem',
    width: '100%',
    padding: theme.spacing(4),
    ...theme.palette.card
  },
  newCourses__title: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary
  },
  newCourses__item: {
    marginTop: theme.spacing(1.5),
  },
  label: {
    marginLeft: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    color: '#fff',
    fontSize: '0.8125rem',
    borderRadius: 5,
    fontWeight: 'bold',
    textShadow: 'none'
  },
  label__hot: {
    // backgroundColor: 'crimson',
    ...theme.palette.secondary.gradient
  },
  label__new: {
    ...theme.palette.primary.gradient
  },
  label__saleOff: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  label__bestSeller: {
    ...theme.palette.secondary.gradient
  },
  btnSignUp: {
    ...theme.palette.secondary.gradient,
    '&:hover': {
      ...theme.palette.secondary.gradient,
    }
  },
  finishStatusIcon: {
    fontSize: '1rem'
  },
  finishStatusIcon__finished: {
    color: theme.palette.success.light,
  },
  finishStatusIcon__unfinished: {
    color: theme.palette.text.disabled
  },
  bulletIcon: {
    color: theme.palette.background.carouselBullet
  },
  icon: {
    color: theme.palette.icon
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));


const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const userState = useSelector(state => ({
    ...state.user
  }), shallowEqual);

  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        const res = await homeApi.getAll();
        const newData = res.data;

        for (const key in newData) {
          newData[key] = newData[key].map(item => ({
            ...item,
            href: key !== 'mostRegisteredCategory'
              ? availablePages.COURSE_DETAILS.path.replace(':courseId', item._id)
              : availablePages.CATEGORY_COURSES.path.replace(':categoryId', item._id)
          }));
        }

        setData(newData);
        dispatch(setLoading(false));
      } catch (error) {
        if (error.messages && error.messages.length > 0) {
          dispatch(showNotification('error', apiMessage[error.messages[0]]));
        }
      }
    };

    fetchData();
  }, []);

  if (!data)
    return <></>;

  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.bannerCover}>
          <Box ml={-2} display="flex" justifyContent="center" alignItems="center" className={`animate__animated animate__fadeInRight`}>
            <img
              alt="Logo"
              src={APP_LOGO_IMAGE}
              className={classes.logoImage}
            />
            <Typography className={`${classes.bannerText} ${classes.bannerTitle}`} variant="h1">{APP_NAME}</Typography>
          </Box>
          <Typography className={`${classes.bannerText} ${classes.bannerSubTitle} animate__animated animate__fadeInLeft`} variant="h4">{APP_SLOGAN}</Typography>
          {!userState.authUser && (
            <Box my={3} display="flex" justifyContent="center" alignItems="center">
              <Button
                className={`${classes.btnSignUp} animate__animated animate__bounceIn`}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => history.push(availablePages.SIGN_UP.path)}
              >
                Đăng ký ngay
            </Button>
            </Box>
          )}
        </Box>
      </div>

      <main className={`${classes.main} animate__animated animate__fadeIn`}>
        <div className={classes.featuredCourses}>
          <Box display="flex" alignItems="center">
            {/* <StarIcon color="primary" className={`${classes.starIcon} ${classes.featuredCoursesCarouselTitleIcon}`} /> */}
            <EmojiEventsIcon color="primary" className={`${classes.starIcon} ${classes.featuredCoursesCarouselTitleIcon}`} />
            <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography variant="h4" className={classes.featuredCourses__title}><b>Khóa học nổi bật trong tuần qua</b></Typography>
              <Box display="flex" alignItems="center">
                <Box mr={1}><FiberManualRecordIcon color="secondary" /></Box>
                <Box mr={1}><FiberManualRecordIcon className={classes.bulletIcon} /></Box>
                <Box mr={1}><FiberManualRecordIcon className={classes.bulletIcon} /></Box>
              </Box>
            </Box>
          </Box>
          <div className={classes.featuredCoursesCarousel}>
            <Carousel showThumbs={false} autoPlay={true} interval={2000} infiniteLoop={true} showStatus={false}>
              {(data.outstandingCourseList || []).map(c => (
                <RouterLink key={c._id} to={c.href}>
                  <ButtonBase>
                    <div className={classes.featuredCoursesCarouselItem}>
                      <img className={classes.featuredCoursesCarouselItem__courseThumbnail} src={c.thumbnailUrl} alt="" />
                      <div className={classes.featuredCoursesCarouselItem__courseThumbnailCover}></div>
                      <div className={`legend ${classes.featuredCoursesCarouselItemLegend}`}>
                        <Grid container alignItems="flex-end">
                          <Grid item xs={8}>
                            <Box display="flex">
                              <Typography variant="body2" color="inherit" gutterBottom>{c.categoryCluster.categories[0].name.toUpperCase()}</Typography>
                              <Box ml={1}>
                                <Tooltip title={c.isFinished ? STATUS.COURSE.FINISHED : STATUS.COURSE.UNFINISHED}>
                                  <CheckCircleIcon className={clsx(classes.finishStatusIcon, {
                                    [classes.finishStatusIcon__finished]: c.isFinished,
                                    [classes.finishStatusIcon__unfinished]: !c.isFinished
                                  })} />
                                </Tooltip>
                              </Box>
                            </Box>
                            <Typography variant="h4" color="inherit" style={{ textTransform: 'uppercase' }}><b>{c.title}</b></Typography>

                            <Box display="flex" alignItems="center" className={classes.featuredCoursesCarouselItem__ratingDetails}>
                              <Typography variant="body2" color="inherit" style={{ marginRight: 3, marginTop: 1 }}>
                                {c.isBestSeller && (<span className={`${classes.label} ${classes.label__bestSeller}`} style={{ marginLeft: 0, marginRight: 9 }}>Đăng ký nhiều</span>)}
                                {c.isNew && (<span className={`${classes.label} ${classes.label__new}`} style={{ marginLeft: 0, marginRight: 9 }}>Khóa học mới</span>)}
                                <b><span>{`${Math.floor(c.averageRating)}.${(c.averageRating - Math.floor(c.averageRating)) * 10}`}</span></b>
                              </Typography>
                              <Box>
                                <Rating name="read-only" value={c.averageRating} size="small" precision={0.5} readOnly />
                              </Box>
                              <Typography variant="body2" color="inherit" style={{ marginLeft: 3 }}>
                                <NumberFormat value={c.numberOfRatings} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'('} suffix={' lượt đánh giá)'} />
                              </Typography>
                              <Box mx={1}></Box>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                <SchoolIcon className={classes.icon} style={{ fontSize: 16, marginRight: 5 }} />
                                <Typography variant="body2" color="inherit">
                                  <NumberFormat value={c.numberOfRegistrations} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' học viên'} />
                                </Typography>
                              </Box>
                              <Box mx={1}></Box>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                <VisibilityIcon className={classes.icon} style={{ fontSize: 16, marginRight: 5 }} />
                                <Typography variant="body2" color="inherit">
                                  <NumberFormat value={c.numberOfViews} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' lượt xem'} />
                                </Typography>
                              </Box>
                            </Box>

                            <Box display="flex" alignItems="center" mt={1}>
                              <Avatar src={c.lecturer.avatarUrl} style={{ width: 24, height: 24, marginRight: 7 }} />
                              <Typography variant="body2" color="inherit"><b>{c.lecturer.fullName}</b></Typography>
                              <Box mx={0.5}><Typography variant="body2" color="inherit">•</Typography></Box>
                              <Typography variant="body2" color="inherit">{format(c.updatedAtByLecturer, 'vi')}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box display="flex" flexDirection="column" alignItems="flex-end">
                              <Typography variant="h3" className={classes.featuredCoursesCarouselItem__price} color="inherit">
                                <NumberFormat value={c.tuition - c.tuition * c.discountPercent} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={c.discountPercent > 0 ? 'Chỉ còn ' : ''} suffix={'đ'} />
                              </Typography>

                              {c.discountPercent > 0 && (
                                <Typography variant="h5" color="inherit">
                                  <strike>
                                    <NumberFormat value={c.tuition} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={'đ'} />
                                  </strike>
                                  <span className={`${classes.label} ${classes.label__saleOff}`} style={{ marginLeft: 9 }}>Ưu đãi {c.discountPercent * 100}%</span>
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </ButtonBase>
                </RouterLink>
              ))}

            </Carousel>
          </div>
        </div>

        <div className={`${classes.section} ${classes.highestViewCourses}`}>
          <Typography variant="h4" className={classes.highestViewCourses__title}><b>🔥 Khóa học được xem nhiều <span className={`${classes.label} ${classes.label__hot}`}>HOT</span></b></Typography>
          <div className={classes.highestViewCoursesCarousel}>
            <CourseMultiCarousel courses={data.coursesListWithTheMostViews || []} />
          </div>
        </div>

        <div className={classes.section}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <div className={classes.newCourses}>
                <Typography variant="h4" className={classes.newCourses__title}><b>✨ Khóa học mới <span className={`${classes.label} ${classes.label__new}`}>NEW</span></b></Typography>
                {(data.ListOfLatestCourses || []).map(c => (
                  <div key={c._id} className={classes.newCourses__item}>
                    <Course data={c} type="stretch" />
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.popularCategories}>
                <Box display="flex" alignItems="center" pl={4} pb={1.5}>
                  {/* <CategoryIcon color="primary" className={`${classes.starIcon} ${classes.featuredCoursesCarouselTitleIcon}`} /> */}
                  <Typography variant="h5" className={classes.popularCategories__title}><b>Lĩnh vực được đăng ký nhiều</b></Typography>
                </Box>
                <List component="div" disablePadding>
                  {data.mostRegisteredCategory.slice(0, 5).map((c, i) => (
                    <ListItem
                      disableGutters
                      key={c._id}
                    >
                      <ButtonBase
                        className={classes.popularCategories__item}
                        component={CustomRouterLink}
                        to={c.href}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: '100%' }}>
                          <Box display="flex" flexDirection="column">
                            <Typography
                              variant="h6"
                              color="textPrimary"
                              gutterBottom
                            >
                              {c.name}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2">
                                <NumberFormat value={c.totalRegistration} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} suffix={' lượt đăng ký'} />
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="body2">
                              <span className={`${classes.label} ${classes.label__hot}`}>HOT</span>
                            </Typography>
                          </Box>
                        </Box>
                      </ButtonBase>
                    </ListItem>
                  ))}
                </List>
              </div>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
};

export default Home;