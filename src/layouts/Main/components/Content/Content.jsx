import { Box, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ScrollTopButton from 'components/ScrollTopButton/ScrollTopButton';
import { availablePages } from 'constants/global.constant';
import ScrollbarContext from 'contexts/ScrollbarContext';
import * as _ from 'lodash';
import React, { useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { setPageBasics } from 'redux/actions/page.action';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 11)
  },
  title: {
    color: theme.palette.text.secondary
  },
  content: {
    ...theme.palette.card,
    position: 'relative',
    width: '100%',
  }
}));

export default function Content({ inner }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const ps = useRef();

  const pageState = useSelector(state => ({
    ...state.page
  }), shallowEqual);

  if (!pageState.basics) {
    const { pathname } = window.location;
    const page = _.find(availablePages, page => page.path === pathname);
    dispatch(setPageBasics(page));
  }

  const [btnScrollTopDisplay, setBtnScrollTopDisplay] = useState(false);

  const setScrollbarTop = (value) => {
    if (ps.current) {
      ps.current.scrollTop = value;
    }
  }

  const handleScrollY = e => {
    setBtnScrollTopDisplay(e.scrollTop > 0);
  }

  const scrollbarUtils = {
    scrollTop: (value) => {
      setScrollbarTop(value);
    },
    addScrollTop: (value) => {
      if (ps.current) {
        setScrollbarTop(ps.current.scrollTop + value);
      }
    },
  };

  return (
    pageState.basics && (
      <PerfectScrollbar
        className={classes.root}
        onScrollY={handleScrollY}
        containerRef={el => (ps.current = el)}
      >
        <ScrollbarContext.Provider value={scrollbarUtils}>
          <Box display="flex" flexDirection="column" justifyContent="center" className={`${classes.content}`}>
            <Box display="flex" alignItems="center" p={2.5} pt={4} pb={0} className={classes.title}>
              <Box mr={0.5}>
                <IconButton color="inherit" onClick={() => history.goBack()}>
                  <ArrowBackIosIcon fontSize="small" style={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="h4" color="inherit"><b>{pageState.basics.title}</b></Typography>
            </Box>
            <Box>
              {inner}
            </Box>
          </Box>
        </ScrollbarContext.Provider>
        {btnScrollTopDisplay && <ScrollTopButton onClick={() => scrollbarUtils.scrollTop(0)} />}
      </PerfectScrollbar>
    )
  )
}
