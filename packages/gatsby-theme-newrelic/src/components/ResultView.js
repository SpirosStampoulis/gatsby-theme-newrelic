import PropTypes from 'prop-types';
import React from 'react';

import {
  appendClassName,
  getUrlSanitizer,
} from '@elastic/react-search-ui-views/es/view-helpers';
import { isFieldValueWrapper } from '@elastic/react-search-ui-views/es/types/FieldValueWrapper';
import { css } from '@emotion/core';
import ExternalLink from './ExternalLink';
import Tag from './Tag';

const getFieldType = (result, field, type) => {
  if (result[field]) return result[field][type];
};

const getRaw = (result, field) => {
  return getFieldType(result, field, 'raw');
};

const getSnippet = (result, field) => {
  return getFieldType(result, field, 'snippet');
};

const htmlEscape = (str) => {
  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const getEscapedField = (result, field) => {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  const safeField =
    getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(', ') : safeField;
};

const getEscapedFields = (result) => {
  return Object.keys(result).reduce((acc, field) => {
    // If we receive an arbitrary value from the response, we may not properly
    // handle it, so we should filter out arbitrary values here.
    //
    // I.e.,
    // Arbitrary value: "_metaField: '1939191'"
    // vs.
    // FieldValueWrapper: "_metaField: {raw: '1939191'}"
    if (!isFieldValueWrapper(result[field])) return acc;
    return { ...acc, [field]: getEscapedField(result, field) };
  }, {});
};

const ResultView = ({
  className,
  result,
  onClickLink,
  titleField,
  urlField,
  ...rest
}) => {
  const fields = getEscapedFields(result);
  const title = getEscapedField(result, titleField);
  const url = getUrlSanitizer(URL, window.location)(getRaw(result, urlField));
  // Pulls subdomain from URL:
  // e.g. https://developer.newrelic.com => developer
  const newRelicSite = fields.url.split('.newrelic')[0].slice(8);

  return (
    <li className={appendClassName('sui-result', className)} {...rest}>
      <div className="sui-result__header">
        {title && !url && (
          <h3
            className="sui-result__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {title && url && (
          <ExternalLink
            className="sui-result__title sui-result__title-link"
            href={url}
            onClick={onClickLink}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
      </div>
      <div className="sui-result__body">
        <ul className="sui-result__details">
          <li
            css={css`
              margin-bottom: 0.25rem;
            `}
          >
            <span
              className="sui-result__value"
              dangerouslySetInnerHTML={{ __html: fields.body }}
            />
          </li>
          <li>
            <Tag
              css={css`
                text-transform: uppercase;
              `}
            >
              {newRelicSite}
            </Tag>
          </li>
        </ul>
      </div>
    </li>
  );
};

ResultView.propTypes = {
  result: PropTypes.object.isRequired,
  onClickLink: PropTypes.func.isRequired,
  className: PropTypes.string,
  titleField: PropTypes.string,
  urlField: PropTypes.string,
};

export default ResultView;
