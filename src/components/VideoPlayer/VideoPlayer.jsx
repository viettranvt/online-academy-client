import { Video } from 'cloudinary-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from 'redux/actions/app.action';
import { apiMessage } from 'constants/api-message.constant';
import { courseApi } from 'api';
import { userRole } from 'constants/user-role.constant';

function VideoPlayer({ course, video }) {
  const dispatch = useDispatch();

  const authUser = useSelector(state => ({
    ...state.user.authUser
  }));

  const handlePlayVideo = async () => {
    if (authUser.role !== userRole.STUDENT.value || !course.isRegistered)
      return;

    try {
      await courseApi.addVideoWatching(course._id, { videoId: video._id });
    } catch (error) {
      if (error.messages && error.messages.length > 0) {
        dispatch(showNotification('error', apiMessage[error.messages[0]]));
      }
    }
  }

  return (
    <Video
      cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
      publicId={video.publicIdOfVideo}
      poster={video.thumbnailUrl}
      controls
      style={{ width: '100%', height: '100%' }}
      onPlay={handlePlayVideo}
    />
  )
}

export default React.memo(VideoPlayer);
