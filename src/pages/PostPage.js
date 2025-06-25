import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function AddPostPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    coverImage: ""
  });

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/posts/addPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Success!", "Post added successfully!", "success");
        navigate(`/posts/${data._id}`);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to add post", "error");
      });
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Add New Blog Post</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Post Title"
                  value={postData.title}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  type="text"
                  name="coverImage"
                  placeholder="Cover Image URL"
                  value={postData.coverImage}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  name="content"
                  rows={6}
                  placeholder="Write your post content here..."
                  value={postData.content}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={12} className="text-end">
                <Button type="submit" variant="primary">
                  Submit Post
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
