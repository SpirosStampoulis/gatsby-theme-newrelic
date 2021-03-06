import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const menuLine = (isOpen) => css`
  width: 100%;
  height: 2px;
  background-color: var(--color-brand-600);
  margin: 4px 0;
  border-radius: 5px;
  transition: 0.18s;

  .dark-mode & {
    background-color: var(--color-dark-800);
  }

  ${isOpen &&
  `
  :nth-child(1) {
    transform: rotate(-45deg) translate(-2px, 6.25px);
  }

  :nth-child(2) {
    opacity: 0;
    margin: 0
  }

  :nth-child(3) {
    transform: rotate(45deg) translate(-2px, -6.25px);
  }`}
`;

const HamburgerMenu = ({ onToggle, isOpen, className }) => (
  <button
    aria-expanded={isOpen}
    aria-label="Mobile Menu"
    type="button"
    css={css`
      display: block;
      background: none;
      border: 0;
      cursor: pointer;
      width: 1.5rem;
      outline: none;
      padding: 0;
    `}
    className={className}
    onClick={() => onToggle()}
  >
    <div css={menuLine(isOpen)} />
    <div css={menuLine(isOpen)} />
    <div css={menuLine(isOpen)} />
  </button>
);

HamburgerMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
};

HamburgerMenu.defaultProps = {
  isOpen: false,
};

export default HamburgerMenu;
