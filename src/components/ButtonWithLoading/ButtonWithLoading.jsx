import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

const ButtonWithLoading = (props) => {
  const { text, size, variant, className, loading, onClick, disabled, progressColor, fullWidth, color } = props;

  const handleButtonClick = () => {
    onClick();
  };

  return (
    <Button
      fullWidth={fullWidth}
      className={className}
      size={size || 'medium'}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={handleButtonClick}
    >
      <Box display="flex" alignItems="center">
        {loading && <CircularProgress size={16} color={progressColor} />}
        <Box ml={1}>{text.toUpperCase()}</Box>
      </Box>
    </Button>
  );
}

export default ButtonWithLoading;