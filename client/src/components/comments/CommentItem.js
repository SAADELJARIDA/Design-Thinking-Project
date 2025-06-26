import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import AuthContext from '../../context/auth/authContext';
import CommentContext from '../../context/comment/commentContext';

const CommentItem = ({ comment }) => {
  const authContext = useContext(AuthContext);
  const commentContext = useContext(CommentContext);
  const { deleteComment } = commentContext;
  const { user } = authContext;

  const { _id, text, name, user: commentUser, date } = comment;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
              {name && name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">
              <Moment format="MMMM DD, YYYY">{date}</Moment>
            </p>
          </div>
        </div>
        {user && user._id === commentUser && (
          <button
            onClick={() => deleteComment(_id)}
            className="text-gray-400 hover:text-red-500"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      <div className="mt-2">
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired
};

export default CommentItem; 