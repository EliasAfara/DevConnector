import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' /> // Not authenticated, will be redirected to login page
      ) : (
        <Component {...props} /> // Authendicated will load the component
      )
    }
  />
); // Check if we are authenticated or not.

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Pulling all th state that's in the auth reducer
});

export default connect(mapStateToProps)(PrivateRoute);
