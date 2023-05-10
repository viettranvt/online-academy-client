import { APP_NAME } from 'constants/global.constant';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';

const PageWithTitle = (props) => {
  const pageBasics = useSelector(state => ({
    ...state.page.basics
  }), shallowEqual);

  useEffect(() => {
    const { title } = pageBasics;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [pageBasics.title]);

  return props.children;
};

PageWithTitle.propTypes = {
  title: PropTypes.string
};

export default PageWithTitle;