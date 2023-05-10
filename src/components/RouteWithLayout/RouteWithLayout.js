import React from 'react';
import PropTypes from 'prop-types';
import { PageWithTitle } from '../../components/PageWithTitle';
import { GuardedRoute } from 'react-router-guards';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, title, ...rest } = props;

  return (
    <GuardedRoute
      {...rest}
      render={matchProps => (
        <Layout>
          <PageWithTitle title={title}>
            <Component {...matchProps} />
          </PageWithTitle>
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  title: PropTypes.string
};

export default RouteWithLayout;
