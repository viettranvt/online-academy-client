/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import { Button, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { availablePages } from 'constants/global.constant';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { setPageBasics } from 'redux/actions/page.action';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: theme.spacing(1)
  },
  button: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.text.sidebarActive,
    fontWeight: 'bold',
    '& $icon': {
      color: theme.palette.primary.main
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light1,
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = (pageId) => {
    const page = _.find(availablePages, page => page._id === pageId);
    dispatch(setPageBasics(page));
  }

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
            onClick={() => handleClick(page._id)}
          >
            <div className={classes.icon}><page.icon fontSize="small" /></div>
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
