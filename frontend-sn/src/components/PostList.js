import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/api/posts', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="post-list">
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
