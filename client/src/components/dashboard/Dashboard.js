import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Expercience from './Expercience';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>

      {profile !== null ? (
        <>
          {
            <>
              <DashboardActions />
              <br />
              <Link to={`/profile/${user._id}`} className='btn btn-primary'>
                View Profile
              </Link>
              {profile.experience.length > 0 ? (
                <>
                  <Expercience experience={profile.experience} />
                </>
              ) : (
                <h4>No experience credentials</h4>
              )}
              {profile.education.length > 0 ? (
                <>
                  <Education education={profile.education} />{' '}
                </>
              ) : (
                <h4>No education credentials</h4>
              )}
            </>
          }

          {
            <div className='my-2'>
              <button
                className='btn btn-danger'
                onClick={() => deleteAccount()}
              >
                <i className='fas fa-user-minus' /> Delete My Account
              </button>
            </div>
          }
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
