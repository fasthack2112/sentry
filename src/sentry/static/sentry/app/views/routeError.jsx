import {withRouter} from 'react-router';
import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';

import sdk from 'app/utils/sdk';
import getRouteStringFromRoutes from 'app/utils/getRouteStringFromRoutes';

class RouteError extends React.Component {
  static propTypes = {
    /**
     * Disable logging to Sentry
     */
    disableLogSentry: PropTypes.bool,
    error: PropTypes.object.isRequired,
    routes: PropTypes.array,
  };

  static contextTypes = {
    organization: PropTypes.object,
    project: PropTypes.object,
  };

  componentWillMount() {
    let {disableLogSentry, routes, error} = this.props;
    let {organization, project} = this.context;

    if (disableLogSentry) return;
    if (!error) return;

    let route = getRouteStringFromRoutes(routes);
    if (route) {
      error = new Error(error.message + `: ${route}`);
    }
    // TODO(dcramer): show something in addition to embed (that contains it?)
    // throw this in a timeout so if it errors we dont fall over
    this._timeout = window.setTimeout(() => {
      sdk.captureException(error, {
        fingerprint: ['route-error', ...(route ? [route] : [])],
        extra: {
          route,
          orgFeatures: (organization && organization.features) || [],
          orgAccess: (organization && organization.access) || [],
          projectFeatures: (project && project.features) || [],
        },
      });
      // TODO(dcramer): we do not have errorId until send() is called which
      // has latency in production so this will literally never fire
      sdk.showReportDialog();
    });
  }

  componentWillUnmount() {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
    }
    $('.sentry-error-embed-wrapper').remove();
  }

  render() {
    // TODO(dcramer): show additional resource links
    return (
      <div className="alert alert-block alert-error">
        <div style={{fontSize: 24, marginBottom: 10}}>
          <span className="icon-exclamation" style={{fontSize: 20, marginRight: 10}} />
          <span>Oops! Something went wrong</span>
        </div>
        <p>
          It looks like you've hit an issue in our client application. Don't worry though!
          We use Sentry to monitor Sentry and it's likely we're already looking into this!
        </p>
        <p>If you're daring, you may want to try the following:</p>
        <ul>
          {window &&
            window.adblockSuspected && (
              <li>
                We detected something AdBlock-like. Try disabling it, as it's known to
                cause issues.
              </li>
            )}
          <li>
            Give it a few seconds and{' '}
            <a
              onClick={() => {
                window.location.href = window.location.href;
              }}
            >
              reload the page
            </a>.
          </li>
          <li>
            If all else fails,{' '}
            <a href="http://github.com/getsentry/sentry/issues">create an issue</a> with
            more details.
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(RouteError);
export {RouteError};
