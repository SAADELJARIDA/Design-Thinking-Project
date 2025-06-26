import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommentContext from '../../context/comment/commentContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Spinner from '../layout/Spinner';

const Comments = ({ postId }) => {
  const commentContext = useContext(CommentContext);
  const { comments, getComments, loading } = commentContext;

  useEffect(() => {
    getComments(postId);
    // eslint-disable-next-line
  }, [postId]);

  if (loading) return <Spinner />;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments</h3>
      <CommentForm postId={postId} />
      
      <div className="mt-8">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired
};

export default Comments; 