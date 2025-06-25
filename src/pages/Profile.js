import { useContext, useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    profileImage: ""
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setUser(data);
          setFormData({
            username: data.username ?? "",
            profileImage: data.profileImage ?? ""
          });
        } else {
          Swal.fire("Error", "Failed to load user data", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Server error", "error"));
  }, [setUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (!formData.username.trim()) {
        return Swal.fire("Username is required", "", "warning");
      }

    fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          Swal.fire("Profile Updated!", "", "success");
          setShowEdit(false);
        } else {
          Swal.fire("Failed to update", data.message || "Unknown error", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Server error", "error"));
  };

  return (
    <div className="container mt-5">
      <Card className="shadow-lg text-center p-4 w-50 mx-auto">
        <img
          src={user?.profileImage || "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc="}
          alt="Profile"
          className="rounded-circle mb-3 mx-auto"
          width={200}
          height={200}
        />
        <h4>{user.username}</h4>
        <p className="text-muted">{user.email}</p>
        <Button variant="primary" onClick={() => setShowEdit(true)}>
          Edit Profile
        </Button>
      </Card>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
