import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPostData, setEditPostData] = useState({ title: "", content: "", coverImage: "" });

  const isAuthorOrAdmin = user && post && (user.id === post.author?._id || user._id === post.author?._id || user?.isAdmin);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/getPost/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPost(data);
      })
      .catch(err => console.error("Error fetching post:", err));
  }, [postId]);

  const handleDeletePost = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete"
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/posts/deletePost/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
          .then(() => {
            Swal.fire("Deleted!", "Post has been deleted.", "success");
            navigate("/");
          });
      }
    });
  };

  const handleAddComment = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/addComment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ comment: newComment })
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Comment Added", "", "success");
        setPost(prev => ({ ...prev, comments: data.comments }));
        setNewComment("");
      });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/deleteComment/${postId}/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Deleted!", data.message, "success");
        setPost(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== commentId)
        }));
      });
  };

  const openEditModal = () => {
    setEditPostData({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage || ""
    });
    setShowEditModal(true);
  };

  const handleUpdatePost = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/updatePost/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(editPostData)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Updated!", "Post updated successfully!", "success");
        setPost(data.post);
        setShowEditModal(false);
      })
      .catch(() => Swal.fire("Error", "Failed to update post", "error"));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p className="text-muted">
        {post.updatedAt === post.createdAt ? `Posted on ${post.createdAt}` : `Updated on ${post.updatedAt}`}
      </p>

      <div className="mb-3">
        <strong>By:</strong> {post.author?.username}
      </div>

      {post.coverImage && (
        <img src={post.coverImage} alt="Cover" style={{ maxWidth: "300px" }} className="mb-3" />
      )}

      <p>{post.content}</p>

      {isAuthorOrAdmin && (
        <div className="mb-3">
          <Button variant="warning" className="me-2" onClick={openEditModal}>Edit Post</Button>
          <Button variant="danger" onClick={handleDeletePost}>Delete Post</Button>
        </div>
      )}

      <hr />
      <h5>🗨️ Comments ({post.comments?.length || 0})</h5>

      {post.comments?.map(comment => {
        const username = comment.userId?.username || "User";

        const isAuthorOrAdmin =
          user &&
          (
            comment.userId?._id?.toString() === user._id?.toString() ||
            comment.userId?._id?.toString() === user.id?.toString() ||
            comment.userId?.toString() === user._id?.toString() ||
            user.isAdmin
          );

        return (
          <div key={comment._id} className="border p-2 rounded mb-2">
            <p className="mb-1">{comment.comment}</p>
            <small className="text-muted">by {username}</small>

            {isAuthorOrAdmin && (
              <Button
                size="sm"
                variant="outline-danger"
                className="ms-2"
                onClick={() => handleDeleteComment(comment._id)}
              >
                Delete
              </Button>
            )}
          </div>
        );
      })}


      <>
        <hr />
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Add Comment
        </button>
      </>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={editPostData.title}
                onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                name="coverImage"
                value={editPostData.coverImage}
                onChange={(e) => setEditPostData({ ...editPostData, coverImage: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={editPostData.content}
                onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdatePost}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
