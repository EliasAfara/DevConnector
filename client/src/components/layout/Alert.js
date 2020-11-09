import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    // JSX
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {
        // alert message
        alert.msg
      }
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// Fetch alert state (Mapping redux state into a props)
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
