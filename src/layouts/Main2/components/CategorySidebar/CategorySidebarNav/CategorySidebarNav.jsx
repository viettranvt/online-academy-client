/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import CategorySidebarNavItem from './CategorySidebarNavItem/CategorySidebarNavItem';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '22.5rem'
  }
}));

const CategorySidebarNav = props => {
  const { categoryClusters, className, ...rest } = props;

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {(categoryClusters || []).map(item => (
        <CategorySidebarNavItem key={item._id} data={item} />
      ))}
    </List>
  );
};

CategorySidebarNav.propTypes = {
  className: PropTypes.string,
  categoryClusters: PropTypes.array.isRequired
};

export default CategorySidebarNav;
