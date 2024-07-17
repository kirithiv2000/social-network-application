import React from 'react';
import './Post.css';

const Post = ({ post }) => {
  return (
    <div className="post">
      <h3>{post.user.username}</h3>
      <p>{post.content}</p>
      <span>{new Date(post.createdAt).toLocaleString()}</span>
    </div>
  );
};

export default Post;
