import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { graphql, useStaticQuery, navigate, Link } from 'gatsby';
import AnnouncementBanner from './AnnouncementBanner';
import DarkModeToggle from './DarkModeToggle';
import ExternalLink from './ExternalLink';
import Button from './Button';
import Dropdown from './Dropdown';
import NewRelicLogo from './NewRelicLogo';
import Icon from './Icon';
import SwiftypeSearch from './SwiftypeSearch';
import Overlay from './Overlay';
import GlobalNavLink from './GlobalNavLink';
import SearchInput from './SearchInput';
import useMedia from 'use-media';
import { useLocation } from '@reach/router';
import useQueryParams from '../hooks/useQueryParams';
import useLocale from '../hooks/useLocale';
import useThemeTranslation from '../hooks/useThemeTranslation';
import path from 'path';
import { rgba } from 'polished';

const action = css`
  color: var(--secondary-text-color);
  transition: all 0.2s ease-out;

  &:hover {
    color: var(--secondary-text-hover-color);
  }
`;

const actionLink = css`
  ${action};

  display: flex;
  align-items: center;
`;

const actionIcon = css`
  display: block;
  cursor: pointer;
`;

const GlobalHeader = ({ className }) => {
  const location = useLocation();
  const { queryParams, setQueryParam } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useThemeTranslation();

  const {
    allLocale: { nodes: locales },
    site,
  } = useStaticQuery(graphql`
    query GlobalHeaderQuery {
      site {
        siteMetadata {
          utmSource
          siteUrl
        }
      }
      allLocale(sort: { fields: [isDefault, locale], order: [DESC, ASC] }) {
        nodes {
          locale
          name
          isDefault
        }
      }
    }
  `);

  const {
    siteMetadata: { utmSource, siteUrl },
  } = site;

  const hideLogoText = useMedia({ maxWidth: '655px' });
  const useCondensedHeader = useMedia({ maxWidth: '585px' });
  const inDocsSite = [
    'https://docs.newrelic.com',
    'https://docs-preview.newrelic.com',
  ].includes(siteUrl);

  const matchLocalePath = new RegExp(
    `^\\/(${locales.map(({ locale }) => locale).join('|')})`
  );

  const locale = useLocale();

  return (
    <>
      <AnnouncementBanner />
      <div
        data-swiftype-index={false}
        className={className}
        css={css`
          background-color: var(--color-neutrals-100);
          position: sticky;
          top: 0;
          z-index: 80;

          .dark-mode & {
            background-color: var(--color-dark-100);
          }
        `}
      >
        <div
          css={css`
            height: var(--global-header-height);
            display: flex;
            justify-content: space-between;
            max-width: var(--site-max-width);
            margin: 0 auto;
            padding: 0 var(--site-content-padding);
          `}
        >
          <Overlay
            isOpen={queryParams.has('q')}
            onCloseOverlay={() => {
              navigate(location.pathname);
              setSearchQuery('');
            }}
          >
            <SwiftypeSearch
              key={queryParams.get('q')}
              css={css`
                display: flex;
                flex-direction: column;
                max-width: 950px;
                margin: 3rem auto;
                height: calc(100vh - 6rem);
              `}
            />
          </Overlay>
          <nav
            css={css`
              display: flex;
              align-items: center;
              height: 100%;
              overflow: hidden;
              position: relative;

              @media screen and (max-width: 800px) {
                &::after {
                  content: '';
                  position: absolute;
                  right: 0;
                  height: 100%;
                  width: 2rem;
                  pointer-events: none;
                  background: linear-gradient(
                    to right,
                    ${rgba('#f4f5f5', 0)},
                    var(--color-neutrals-100)
                  );

                  .dark-mode & {
                    background: linear-gradient(
                      to right,
                      ${rgba('#22353c', 0)},
                      var(--color-dark-100)
                    );
                  }
                }
              }
            `}
          >
            <ExternalLink
              href="https://newrelic.com/"
              css={css`
                display: flex;
                align-items: center;
                margin-right: 1rem;
              `}
            >
              <NewRelicLogo omitText={hideLogoText} />
            </ExternalLink>

            <ul
              css={css`
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                list-style-type: none;
                white-space: nowrap;
                overflow-x: auto;
                position: relative;
                -webkit-overflow-scrolling: touch;
                -ms-overflow-style: -ms-autohiding-scrollbar;

                > li {
                  flex: 0 0 auto;
                }
              `}
            >
              <li>
                <GlobalNavLink href="https://docs.newrelic.com/">
                  Docs
                </GlobalNavLink>
              </li>
              <li>
                <GlobalNavLink href="https://developer.newrelic.com/">
                  Developers
                </GlobalNavLink>
              </li>
              <li>
                <GlobalNavLink href="https://opensource.newrelic.com/">
                  Open Source
                </GlobalNavLink>
              </li>
              <li>
                <GlobalNavLink href="https://discuss.newrelic.com/">
                  Community
                </GlobalNavLink>
              </li>
            </ul>
          </nav>

          <ul
            css={css`
              margin: 0;
              margin-left: 1rem;
              padding: 0;
              display: flex;
              list-style-type: none;
              align-items: center;
              flex: 1;

              > li {
                transition: all 0.2s ease-out;
                color: var(--secondary-text-color);

                &:not(:first-of-type) {
                  margin-left: 0.5rem;
                }
              }
            `}
          >
            <li
              css={css`
                flex: 1;
              `}
            >
              {useCondensedHeader ? (
                <Link to="?q=" css={actionLink}>
                  <Icon css={actionIcon} name="fe-search" size="0.875rem" />
                </Link>
              ) : (
                <SearchInput
                  placeholder={t('searchInput.placeholder')}
                  size={SearchInput.SIZE.SMALL}
                  onClear={() => setSearchQuery('')}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={(value) => {
                    setQueryParam('q', value);
                  }}
                  value={searchQuery}
                  focusWithHotKey="/"
                  css={css`
                    min-width: 150px;
                    max-width: 350px;
                  `}
                />
              )}
            </li>
            {locales.length > 1 && (
              <li>
                <Dropdown align="right">
                  <Dropdown.Toggle
                    size={Button.SIZE.EXTRA_SMALL}
                    variant={Button.VARIANT.LINK}
                  >
                    {useCondensedHeader
                      ? locale.locale.toUpperCase()
                      : locale.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {locales.map(({ locale, name, isDefault }) => (
                      <Dropdown.MenuItem
                        as={Link}
                        key={locale}
                        href={path.join(
                          '/',
                          isDefault ? '' : locale,
                          location.pathname.replace(matchLocalePath, '')
                        )}
                      >
                        {name}
                      </Dropdown.MenuItem>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )}
            <li>
              <DarkModeToggle css={[actionIcon, action]} size="0.875rem" />
            </li>
            <li
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <Button
                as={ExternalLink}
                size={Button.SIZE.EXTRA_SMALL}
                variant={Button.VARIANT.LINK}
                href="https://one.newrelic.com"
                css={css`
                  font-weight: 600;
                  white-space: nowrap;
                `}
              >
                {t('button.login')}
              </Button>
            </li>
            <li
              css={css`
                display: flex;
              `}
            >
              <Button
                as={ExternalLink}
                href={`https://newrelic.com/signup${
                  utmSource ? `?utm_source=${utmSource}` : ''
                }`}
                size={Button.SIZE.EXTRA_SMALL}
                variant={Button.VARIANT.PRIMARY}
              >
                <span>
                  {inDocsSite ? t('button.signUp') : t('button.startNow')}
                </span>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

GlobalHeader.propTypes = {
  className: PropTypes.string,
};

export default GlobalHeader;
