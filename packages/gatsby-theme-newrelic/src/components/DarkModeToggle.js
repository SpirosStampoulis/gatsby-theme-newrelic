import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Icon from './Icon';
import useDarkMode from 'use-dark-mode';

const DarkModeToggle = ({ className, size, onClick }) => {
  const darkMode = useDarkMode();

  return (
    <Icon
      name={darkMode.value ? 'fe-sun' : 'fe-moon'}
      className={className}
      size={size}
      onClick={(e) => {
        darkMode.toggle();

        if (onClick) {
          onClick(e);
        }
      }}
      css={css`
        cursor: pointer;
      `}
    />
  );
};

DarkModeToggle.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

export default DarkModeToggle;
