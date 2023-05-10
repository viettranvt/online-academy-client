import { Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Fab, Grid, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MovieIcon from '@material-ui/icons/Movie';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import clsx from 'clsx';
import { VideoPlayer } from 'components/VideoPlayer';
import { userRole } from 'constants/user-role.constant';
import * as moment from 'moment';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

function VideoLibrary({
  classes,
  expandedChapterIndex,
  index,
  activeVideo,
  handlePlayVideo,
  userState,
  handleClickBtnAddVideo,
  expandedChapterVideoListLoading,
  expandedChapterVideoList,
  handleClickVideoListItem
}) {
  return (
    <div>
      {expandedChapterIndex === index && (
        <Box className={classes.chapter__content}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {activeVideo && (
                <div className={classes.videoPlayer}>
                  <div className={classes.videoPlayer__video}>
                    <VideoPlayer
                      video={activeVideo}
                      onPlay={handlePlayVideo}
                    />
                  </div>
                  <Box px={2} pt={2} pb={1}>
                    <Typography variant="h4" gutterBottom><b>{activeVideo.title}</b></Typography>
                    <Typography variant="body2" gutterBottom>
                      <span>Đăng lúc {moment(activeVideo.updatedAt).format('DD/MM HH:mm')} </span>
                    </Typography>
                  </Box>
                </div>
              )}
              {!activeVideo && (
                <div className={classes.videoPlayerEmpty}></div>
              )}
            </Grid>
            <Grid item xs={4}>
              <div className={classes.videoListContainer}>
                {userState.authUser && userState.authUser.role === userRole.LECTURER.value && (
                  <Tooltip title="Đăng tải video" className="animate__animated animate__bounceIn">
                    <Fab
                      size="medium"
                      color="primary"
                      aria-label="add"
                      className={classes.btnAddVideo}
                      onClick={handleClickBtnAddVideo}
                    >
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                )}
                <Typography gutterBottom variant="body1" className={classes.videoList__title}>
                  <PlaylistPlayIcon />
                  <span style={{ marginLeft: 3 }}><b>Danh sách video</b></span>
                </Typography>
                {!activeVideo && !expandedChapterVideoListLoading && (
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                    <Box mb={1}>
                      <MovieIcon className={classes.emptyVideoListIcon} fontSize="large" />
                    </Box>
                    <Typography variant="body2">Chưa có video nào.</Typography>
                  </Box>
                )}
                {expandedChapterVideoListLoading && (
                  <Box mt={-2} display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                    <CircularProgress color="primary" />
                  </Box>
                )}
                {activeVideo && (
                  <PerfectScrollbar className={classes.videoList}>
                    {expandedChapterVideoList.map(video => (
                      <Card
                        key={video._id}
                        className={clsx(classes.videoListItem, {
                          [classes.videoListItemActive]: video._id === activeVideo._id,
                          [classes.videoListItemDisabled]: video.disabled
                        })}
                        onClick={() => handleClickVideoListItem(video._id)}
                      >
                        <CardActionArea style={{ height: '100%' }} disabled={video.disabled}>
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
                                <Typography gutterBottom variant="h6" color="inherit"><b>{video.title}</b></Typography>
                                <Typography variant="body2" color="inherit">{`Đăng lúc ${moment(video.updatedAt).format('DD/MM HH:mm')}`}</Typography>
                              </CardContent>
                            </Grid>
                          </Grid>
                        </CardActionArea>
                      </Card>
                    ))}
                  </PerfectScrollbar>
                )}
              </div>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  )
}

export default React.memo(VideoLibrary);
