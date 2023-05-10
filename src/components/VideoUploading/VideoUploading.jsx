import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BackupIcon from '@material-ui/icons/Backup';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '19rem'
  },
  darkCover: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  video: {
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%'
  },
  video__inner: {
    width: '95%',
    height: '95%'
  },
  btnContrast: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)'
    },
    backdropFilter: 'blur(6px)'
  },
}));

export default function VideoUploading({ initVideoUrl, onVideoChange }) {
  const classes = useStyles();
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(initVideoUrl);
  const [uploadingVisible, setUploadingVisible] = useState(true);

  const handleVideoChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let video = e.target.files[0];

    reader.onloadend = () => {
      onVideoChange(video);
      setVideoPreviewUrl(reader.result);
    }

    if (video) {
      reader.readAsDataURL(video);
    }
  }

  const handleMouseOver = (e) => {
    if (uploadingVisible && !videoPreviewUrl)
      return;

    setUploadingVisible(true);
  }

  const handleMouseOut = (e) => {
    if (!videoPreviewUrl)
      return;

    setUploadingVisible(false);
  }

  return (
    <div className={classes.root}>
      <div
        className={classes.darkCover}
        style={{ opacity: uploadingVisible ? 1 : 0 }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <input
          accept="video/*"
          id="video-upload"
          type="file"
          onChange={handleVideoChange}
          hidden
        />
        <label
          htmlFor="video-upload"
          style={{ color: '#fff', opacity: uploadingVisible ? 1 : 0 }}
        >
          <Button startIcon={<BackupIcon />} className={classes.btnContrast} component="span">
            Tải video lên
          </Button>
        </label>
      </div>
      {videoPreviewUrl && (
        <Box p={2} display="flex" justifyContent="center" alignItems="center" className={classes.video}>
          <video className={classes.video__inner}>
            <source src={videoPreviewUrl} type="video/webm" />
            <source src={videoPreviewUrl} type="video/mp4" />
            <source src={videoPreviewUrl} type="video/ogg" />
          </video>
        </Box>
      )}
    </div>
  )
}