import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Link, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  content: {
    paddingTop: 100,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 460
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <Typography variant="h1" gutterBottom>
              404: Không tìm thấy trang
            </Typography>
            <Typography variant="subtitle2">
              Trang này không tồn tại hoặc đường dẫn đến trang có thể đã bị hỏng, vui lòng kiểm tra lại.
            </Typography>
            <Box my={4}>
              <Link
                component="button"
                onClick={() => history.push('/')}
              >
                <Typography variant="subtitle2" color="primary">
                  Trở về trang chủ
                </Typography>
              </Link>
            </Box>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/undraw_page_not_found_su7k.svg"
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
