import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Card, CardActionArea, Grid, CardContent, CardMedia, Box, CircularProgress } from '@material-ui/core';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { format } from 'timeago.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import * as moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from 'redux/actions/app.action';
import { apiMessage } from 'constants/api-message.constant';
import { courseApi } from 'api';
import HistoryIcon from '@material-ui/icons/History';
import { useRef } from 'react';

const useStyles = makeStyles(theme => ({
  videoListEmpty: {
    width: '30.625rem',
    height: '28.125rem',
  },
  videoListEmptyIcon: {
    color: theme.palette.text.disabled
  },
  videoList: {
    height: '28.125rem',
    overflow: 'scroll'
  },
  videoListItem: {
    width: '21.875rem',
    height: '6.25rem',
    marginBottom: theme.spacing(1),
    boxShadow: 'none',
    backgroundColor: theme.palette.background.video,
    borderRadius: 5
  },
  videoListItem__thumbnailContainer: {
    position: 'relative',
    height: '6.25rem'
  },
  videoListItem__thumbnail: {
    height: '100%'
  },
  videoListItem__duration: {
    position: 'absolute',
    bottom: '6%',
    right: '4%',
    padding: theme.spacing(0.25, 0.5),
    color: '#fff',
    backgroundColor: '#1d1d1d',
    fontWeight: 'bold',
    borderRadius: '0.25rem',
    fontSize: '0.6875rem'
  },
  videoListItem__details: {
    padding: theme.spacing(1)
  },
  videoListItem__details__title: {
    "display": "-webkit-box",
    "maxWidth": "100%",
    "WebkitLineClamp": "2",
    "WebkitBoxOrient": "vertical",
    "overflow": "hidden"
  },
}))

export default function WatchHistory({ course, open, onClose, onClickVideo }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const videoListLimit = 5;
  const [videoList, setVideoList] = useState([]);
  const [videoListPage, setVideoListPage] = useState(null);
  const [videoListTotalItems, setVideoListTotalItems] = useState(0);
  const [videoListLoading, setVideoListLoading] = useState(false);

  const ps = useRef();
  const [isScrollDown, setIsScrollDown] = useState(false);

  const getVideos = async (page) => {
    if (videoListLoading)
      return;

    setVideoListLoading(true);
    try {
      const res = await courseApi.getVideoWatchings(course._id, page, videoListLimit);
      const videos = res.data.entries.map(item => ({
        ...item.video,
        createdAt: item.createdAt,
        thumbnailUrl: item.video.thumbnailUrl || 'https://wellstarthealth.com/assets/unique/well_start_default_video_image-369627cf3a7b03756d8ae22abd46a048eaa31e432404c956126e433dd02f2a30.jpg',
      }));
      const newVideoList = page === 1 ? videos : videoList.concat(videos);
      setVideoList(newVideoList);
      setVideoListTotalItems(res.data.meta.totalItems);
      setVideoListLoading(false);
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  }

  useEffect(() => {
    setVideoListPage(open ? 1 : null)
  }, [open])

  useEffect(() => {
    if (!videoListPage)
      return;

    getVideos(videoListPage);
  }, [videoListPage]);

  useEffect(() => {
    if (isScrollDown && videoListLoading) {
      if (ps.current) {
        ps.current.scrollTop -= 100;
      }
    }
  }, [isScrollDown, videoListLoading]);

  const handleClose = () => {
    onClose(false);
  }

  const handleClickVideo = (video) => {
    onClickVideo(video);
  }

  const handleYReachEnd = (container) => {
    if (videoListLoading || videoList.length === videoListTotalItems)
      return;

    container.scrollTop -= (0.1 * container.scrollTop);
    setVideoListPage(videoListPage + 1);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Lịch sử theo dõi video</DialogTitle>
      <DialogContent>
        <Box py={2}>
          {videoList.length > 0 ? (
            <Timeline style={{ padding: 0 }}>
              <PerfectScrollbar
                className={classes.videoList}
                containerRef={el => (ps.current = el)}
                onYReachEnd={handleYReachEnd}
                onScrollDown={() => setIsScrollDown(true)}
                onScrollUp={() => setIsScrollDown(false)}
              >
                {videoList.map((video, i) => (
                  <TimelineItem key={i}>
                    <TimelineOppositeContent>
                      <Typography color="textSecondary" variant="body2">{format(video.createdAt, 'vi')}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card key={video._id} className={classes.videoListItem} onClick={() => handleClickVideo(video)}>
                        <CardActionArea style={{ height: '100%' }}>
                          <Grid container style={{ height: '100%' }}>
                            <Grid item xs={5}>
                              <div className={classes.videoListItem__thumbnailContainer}>
                                <CardMedia
                                  className={classes.videoListItem__thumbnail}
                                  image={video.thumbnailUrl}
                                  title={video.title}
                                />
                                <Typography variant="body2" className={classes.videoListItem__duration}>
                                  {moment.utc(video.duration * 1000).format('mm:ss')}
                                </Typography>
                              </div>
                            </Grid>
                            <Grid item xs={7}>
                              <CardContent className={classes.videoListItem__details}>
                                <Typography gutterBottom variant="h6" className={classes.videoListItem__details__title}><b>{video.title}</b></Typography>
                                <Typography variant="body2">{video.chapter.title}</Typography>
                              </CardContent>
                            </Grid>
                          </Grid>
                        </CardActionArea>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
                {videoListLoading && (
                  <Box pt={4} mb={2} display="flex" justifyContent="center" alignItems="center" style={{ width: '100%' }}>
                    <CircularProgress color="primary" size={12} style={{ marginRight: 5 }} />
                    <Typography variant="body2">Đang tải...</Typography>
                  </Box>
                )}
              </PerfectScrollbar>
            </Timeline>
          ) : (
              <Box display="flex" justifyContent="center" alignItems="center" className={classes.videoListEmpty}>
                {videoListLoading ? (
                  <CircularProgress color="primary" />
                ) : (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                      <Box mb={1}>
                        <HistoryIcon className={classes.videoListEmptyIcon} fontSize="large" />
                      </Box>
                      <Typography variant="body2">Chưa có ghi nhận nào.</Typography>
                    </Box>
                  )}
              </Box>
            )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
