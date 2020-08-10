/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Icon from './Icon';
import Portal from './Portal';
import NewRelicLogo from './NewRelicLogo';
import { useTransition, animated } from 'react-spring';
import { graphql, useStaticQuery } from 'gatsby';
import useKeyPress from '../hooks/useKeyPress';

const Overlay = ({ children, onCloseOverlay, isOpen = false }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        layout {
          maxWidth
          contentPadding
        }
      }
    }
  `);

  const { layout } = site;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = null;
    };
  }, [isOpen]);

  useKeyPress('Escape', onCloseOverlay);

  const open = useTransition(isOpen, null, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
  });

  return (
    <Portal>
      {open.map(
        ({ item, props, key }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              css={css`
                z-index: 100;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow-y: scroll;
                background-color: var(--primary-background-color);
              `}
            >
              <div
                role="button"
                tabIndex="0"
                css={css`
                  &:hover {
                    background-color: var(--secondary-background-color);
                    color: var(--tertiary-text-color);
                  }
                  color: var(--secondary-text-color);
                  cursor: pointer;
                  outline: none;
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
                  padding: 0.25rem 0;
                  height: 30px;
                `}
                onClick={onCloseOverlay}
              >
                <div
                  css={css`
                    max-width: ${layout.maxWidth};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0 auto;
                    padding: 0 ${layout.contentPadding};
                    height: 100%;
                  `}
                >
                  <NewRelicLogo />
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      padding: 0.25rem 0;
                    `}
                  >
                    <span
                      css={css`
                        margin-right: 0.25rem;
                        font-size: 0.75rem;
                      `}
                    >
                      Close
                    </span>
                    <Icon name={Icon.TYPE.X} size="1rem" />
                  </div>
                </div>
              </div>
              <div
                css={css`
                  max-width: ${layout.maxWidth};
                  padding: 0 ${layout.contentPadding};
                  margin: 0 auto;
                `}
              >
                {children}
              </div>
            </animated.div>
          )
      )}
    </Portal>
  );
};

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  onCloseOverlay: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Overlay;
