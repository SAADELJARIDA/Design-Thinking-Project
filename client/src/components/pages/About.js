import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h1>About This App</h1>
      <p className="my-1">
        This is a full stack MERN application for a school blog, showcasing:
      </p>
      <ul className="about-list">
        <li>MongoDB for database storage</li>
        <li>Express for backend API</li>
        <li>React for frontend UI</li>
        <li>Node.js for server runtime</li>
      </ul>
      <p className="my-1">
        <strong>Version:</strong> 1.0.0
      </p>
    </div>
  );
};

export default About; 