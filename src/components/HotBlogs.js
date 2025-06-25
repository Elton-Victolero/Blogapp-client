import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HotBlogs() {
  const [hotPosts, setHotPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/getPosts?limit=5`)
      .then(res => res.json())
      .then(data => setHotPosts(data.posts || []))
      .catch(err => console.error("Failed to load hot blogs:", err));
  }, []);

  return (
    <div className="sidebar p-3 border rounded shadow-sm bg-light">
      <h5 className="mb-5">🔥 Hot Blogs 🔥</h5>
      {hotPosts.length === 0 ? (
        <p>No trending posts.</p>
      ) : (
        <ul className="list-unstyled">
          {hotPosts.map(post => (
            <li key={post._id} className="mb-3">
              <div className="d-flex align-items-center">
                <img
                  src={post.coverImage || "https://via.placeholder.com/60"}
                  alt="cover"
                  className="me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "5px"
                  }}
                />
                <div>
                  <Link to={`/posts/${post._id}`} className="fw-bold text-decoration-none">
                    {post.title}
                  </Link>
                  <div className="small text-muted">
                    By {post.author?.username || "Unknown"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
