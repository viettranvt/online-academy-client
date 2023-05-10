import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import Info from './components/Info/Info';
import Password from './components/Password/Password';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '34rem',
    width: '100%',
    overflow: 'hidden',
    paddingTop: theme.spacing(4)
  },
  tabs: {
    boxShadow: 'none',
    backgroundColor: theme.palette.card.backgroundColor
  },
  tabIcon: {
    color: theme.palette.icon
  },
  content: {
    backgroundColor: theme.palette.background.course
  }
}));

const Profile = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabs} color="primary">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab className={classes.tabIcon} icon={<PersonIcon />} label="Thông tin cá nhân" {...a11yProps(0)} />
          <Tab className={classes.tabIcon} icon={<LockIcon />} label="Thay đổi mật khẩu" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {tabValue === 0 && (
        <Box pl={2} pr={6} py={10} className="animate__animated animate__fadeInLeft" style={{ animationDuration: '0.75s' }}>
          <Info />
        </Box>
      )}

      {tabValue === 1 && (
        <Box px={6} py={10} className="animate__animated animate__fadeInRight" style={{ animationDuration: '0.75s' }}>
          <Password />
        </Box>
      )}

    </div>
  );
};

export default Profile;
