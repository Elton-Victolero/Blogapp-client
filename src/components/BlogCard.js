import { useNavigate } from "react-router-dom";

export default function BlogCard({ post }) {
  const navigate = useNavigate();

  return (
    <div className="post-card border rounded p-3 mb-3 shadow-sm">
      <div className="row">
        {post.coverImage && (
          <div className="col-md-3 d-flex align-items-center justify-content-center">
            <img
              src={post.coverImage}
              alt="Cover"
              className="img-fluid rounded"
              style={{ objectFit: "cover", height: "120px", width: "100%" }}
            />
          </div>
        )}
        <div className={post.coverImage ? "col-md-8" : "col-12"}>
          <h3>{post.title}</h3>

          <div className="d-flex align-items-center mb-2">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: "10px"
              }}
            >
              <img
                src={
                  post.author?.profileImage ||
                  "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc="
                }
                alt="Author"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            <span className="text-muted">
              By {post.author?.username || "Unknown Author"}
            </span>
          </div>

          <p className="text-muted mb-1">
            {post.updatedAt === post.createdAt
              ? `Posted on ${new Date(post.createdAt).toLocaleDateString()}`
              : `Updated on ${new Date(post.updatedAt).toLocaleDateString()}`}
          </p>

          <p>{post.content?.slice(0, 100)}...</p>

          <p className="text-secondary small mb-2">
            🗨️ {post.comments?.length || 0} comment
            {post.comments?.length === 1 ? "" : "s"}
          </p>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/posts/${post._id}`)}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}
