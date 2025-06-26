import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CommentContext from '../../context/comment/commentContext';

const CommentForm = ({ postId }) => {
  const commentContext = useContext(CommentContext);
  const { addComment } = commentContext;

  const [text, setText] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (text.trim() === '') return;

    addComment(postId, { text });
    setText('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired
};

export default CommentForm; 