import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 7;

  const fetchPosts = (currentSkip = 0) => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/getPosts?skip=${currentSkip}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setPosts(prev => {
          const newPosts = data.posts.filter(
            newPost => !prev.some(existingPost => existingPost._id === newPost._id)
          );
          return [...prev, ...newPosts];
        });
        setSkip(currentSkip + data.posts.length);
        setHasMore(data.hasMore);
      })
      .catch(err => console.error("Error fetching posts:", err));
  };


  useEffect(() => {
    fetchPosts(0);
  }, []);

  return (
    <div>
      {posts.map(post => (
        <BlogCard key={post._id} post={post} />
      ))}
      {hasMore && (
        <button onClick={() => fetchPosts(skip)} className="btn btn-primary mt-3">
          Show More
        </button>
      )}
    </div>
  );
}
