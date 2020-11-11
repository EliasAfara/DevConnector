import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Expercience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
        {exp.to === null ? (
          'Present'
        ) : (
          <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
        )}
      </td>
      <td>{exp.description}</td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteExperience(exp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th className='hide-sm'>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th className='hide-sm'>Description</th>
            <th className='hide-sm'>Action</th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </>
  );
};

Expercience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Expercience);
