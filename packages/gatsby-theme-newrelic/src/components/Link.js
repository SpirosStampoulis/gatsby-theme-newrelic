import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link as GatsbyLink } from 'gatsby';
import useLocale from '../hooks/useLocale';
import { localizePath } from '../utils/localization';

const Link = ({ to, ...props }) => {
  const locale = useLocale();

  const {
    site: {
      siteMetadata: { siteUrl },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  if (to.startsWith(siteUrl)) {
    to = to.replace(siteUrl, '');
  }

  if (to.startsWith('/')) {
    return <GatsbyLink to={localizePath({ path: to, locale })} {...props} />;
  }

  if (to.startsWith('#')) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={to} {...props} />;
  }

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={to} target="_blank" rel="noopener noreferrer" {...props} />;
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Link;
