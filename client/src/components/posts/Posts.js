import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? <Spinner /> : <>test</>;
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.isRequired,
};

const mapStateToProps = (state) => ({
  // getting post state
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
