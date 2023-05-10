import { makeStyles } from '@material-ui/core/styles';
import Course from 'components/Course/Course';
import PropTypes from 'prop-types';
import React from 'react';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30
  }
};

const useStyles = makeStyles(theme => ({
  item: {
    paddingBottom: theme.spacing(0.5)
  }
}));

const CourseMultiCarousel = (props) => {
  const classes = useStyles();
  const { courses } = props;

  return (
    <div>
      <Carousel
        swipeable={false}
        draggable={true}
        ssr={true} // means to render carousel on server-side.
        keyBoardControl={true}
        responsive={responsive}
        containerClass="carousel-container"
        // removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType={'desktop'}
        // itemClass={classes.item}
        itemClass={`carousel-item-padding-40-px ${classes.item}`}
      >
        {courses.map(c => {
          return (
            <Course key={c._id} data={c} type="minimal" />
          );
        })}
      </Carousel>
    </div>
  );
};

CourseMultiCarousel.propTypes = {
  courses: PropTypes.array.isRequired
}

export default CourseMultiCarousel;