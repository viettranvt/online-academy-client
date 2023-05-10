import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import darkPalette from './dark-palette';
import typography from './typography';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  darkPalette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;
