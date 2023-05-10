import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: colors.purple[900],
    main: colors.purple[800],
    light: 'rgba(123, 31, 162, 0.1)',
    light1: 'rgba(123, 31, 162, 0.15)',
    gradient: {
      "backgroundColor": "#a4508b",
      "backgroundImage": "linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)"
    }
  },
  secondary: {
    contrastText: white,
    dark: colors.amber[900],
    main: colors.amber[800],
    light: 'rgba(255, 143, 0, 0.1)',
    gradient: {
      "backgroundImage": "linear-gradient(-60deg, #ff5858 0%, #f09819 100%)",
    }
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600],
    disabled: colors.blueGrey[300],
    topbar: colors.purple[900],
    sidebarActive: colors.purple[800],
    videoActive: colors.purple[900]
  },
  background: {
    default: '#f0f2f5',
    appLoading: '#f0f2f5',
    paper: white,
    course: white,
    user: white,
    signIn: white,
    signUp: white,
    sidebar: white,
    searchInput: '#f0f2f5',
    video: '#f8f8f8',
    addCategory: '#f8f8f8',
    comment: '#f8f8f8',
    loading: 'rgba(255,255,255,0.5)',
    btnCategory: white,
    carouselBullet: '#d9d9d9'
  },
  topbar: {
    background: white,
    "boxShadow": "rgba(149, 157, 165, 0.2) 0px 8px 24px"
  },
  sidebar: {
    background: '#f0f2f5',
    "boxShadow": "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
  },
  border: {
    color: '#dcdcdc'
  },
  card: {
    backgroundColor: '#f0f2f5',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    borderRadius: '1.5rem'
  },
  input: {
    '&:before': {
      borderColor: '#dcdcdc'
    }
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200]
};
