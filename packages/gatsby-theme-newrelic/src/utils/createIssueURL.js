const DEFAULT_TITLE = 'Website Feedback';

export const createDescription = ({
  title,
  slug,
  siteUrl,
} = {}) => `## Description
${title && siteUrl && slug ? `Page: [${title}](${siteUrl}${slug})\n` : ''}
[NOTE]: # (Describe the problem you're encountering.)
[TIP]: # (Do NOT give us access or passwords to your New Relic account or API keys!)

## Steps to Reproduce

[NOTE]: # (Please be as specific as possible.)

## Expected Behavior

[NOTE]: # (Tell us what you expected to happen.)

## Relevant Logs / Console output

[NOTE]: # (Please provide specifics of the local error logs, Browser Dev Tools console, etc. if appropriate and possible.)

## Your Environment

[TIP]: # (Include as many relevant details about your environment as possible.)
[TIP]: # (ex: Browser name and version)
[TIP]: # (ex: Operating System and version)

## Additional context

[TIP]: # (Add any other context about the problem here.)
`;

/**
 * Constructs a new issue url with information pre-filled for the user.
 *
 * @param {Object} options
 * @param {string} options.repository The URL for the repository.
 * @param {string?} options.title An (optional) title for the issue.
 * @param {string[]} options.labels An array of label titles.
 * @param {Object} options.page Optional information about the page (title and slug).
 * @param {string} options.page.title The title for the page.
 * @param {string} options.page.slug The slug for the page.
 * @param {string} options.page.siteUrl The base URL for the site.
 * @param {string?} options.description An (optional) description for the issue.
 * @returns {string} The URL for a new issue.
 */
const createIssueURL = ({
  repository,
  title,
  labels = [],
  page = {},
  description,
}) => {
  const baseURL = `${repository}/issues/new`;

  const params = new URLSearchParams();
  params.set('labels', labels.join(','));
  params.set('title', title || DEFAULT_TITLE);
  params.set('body', description || createDescription(page));

  return [baseURL, params.toString()].join('?');
};

export default createIssueURL;
