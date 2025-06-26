import React, { useState, useContext, useEffect } from 'react';
import PostContext from '../../context/post/postContext';
import Post from '../posts/Post';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';
import ActualitesList from '../actualites/ActualitesList';

const Home = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { posts, getPosts, loading, addPost } = postContext;
  const { isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;

  // State for new post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  // State to control form visibility
  const [showPostForm, setShowPostForm] = useState(false);
  
  // State to control which section is active
  const [activeSection, setActiveSection] = useState('posts');

  const { title, content, imageUrl } = newPost;

  useEffect(() => {
    if (localStorage.token) {
      authContext.loadUser();
    }
    getPosts();
    // eslint-disable-next-line
  }, []);

  if (loading && posts.length === 0 && activeSection === 'posts') {
    return <Spinner />;
  }

  const onChange = e => setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') {
      setAlert('Please fill in both title and content', 'danger');
    } else {
      addPost(newPost);
      setAlert('Post Created Successfully', 'success');
      setNewPost({ title: '', content: '', imageUrl: '' });
      setShowPostForm(false); // Hide the form after submission
    }
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Sections">
          <button
            onClick={() => setActiveSection('posts')}
            className={`mr-8 py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeSection === 'posts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveSection('actualites')}
            className={`mr-8 py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeSection === 'actualites'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Actualités
          </button>
        </nav>
      </div>

      {activeSection === 'posts' ? (
        <>
          {isAuthenticated && (
            <>
              {!showPostForm ? (
                <div className="flex justify-end mb-6">
                  <button
                    onClick={togglePostForm}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center"
                  >
                    <span className="material-icons mr-2">add</span>
                    Create New Post
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="flex justify-between items-center bg-gray-50 px-6 py-3 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Create a New Post</h2>
                    <button 
                      onClick={togglePostForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={onSubmit}>
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          placeholder="Post title"
                          name="title"
                          value={title}
                          onChange={onChange}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL (optional)
                        </label>
                        <input
                          type="text"
                          id="imageUrl"
                          placeholder="Enter an image URL"
                          name="imageUrl"
                          value={imageUrl}
                          onChange={onChange}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={imageUrl} 
                              alt="Post preview" 
                              className="max-h-40 rounded" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          id="content"
                          placeholder="Write your post content here..."
                          name="content"
                          value={content}
                          onChange={onChange}
                          rows="5"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Publish Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h1>
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts to display. Be the first to create one!</p>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <Post key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <ActualitesList admin={false} />
      )}
    </div>
  );
};

export default Home; 