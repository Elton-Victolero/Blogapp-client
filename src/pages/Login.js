import { useState, useContext, useEffect } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom"; 
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const authenticate = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          const token = data.access;

          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.isAdmin;

            localStorage.setItem('token', token);

            setUser({
              id: payload.id,
              email: payload.email,
              isAdmin: isAdmin
            });

            Swal.fire({
              title: "Login Successful",
              icon: "success"
            }).then(() => {
              navigate(isAdmin ? "/dashboard" : "/");
            });

            setEmail('');
            setPassword('');
          } catch (error) {
            console.error("Error decoding token:", error);
            Swal.fire({
              title: "Authentication failed",
              icon: "error",
              text: "Invalid token format."
            });
          }
        } else {
          Swal.fire({
            title: "Authentication failed",
            icon: "error",
            text: "Check your login details and try again."
          });
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        Swal.fire({
          title: "Something went wrong",
          icon: "error",
          text: "Please try again later."
        });
      });
  };

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <h1 className="text-center mb-4">Login</h1>
          <Card className="mt-4">
            <Card.Body>
              <Form onSubmit={authenticate}>
                <Form.Group className="mb-3" controlId="userEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant={isActive ? "primary" : "danger"}
                  type="submit"
                  className="w-100"
                  disabled={!isActive}
                >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <p className="text-center mt-3">
            Don't have an account yet? <Link to="/register">Click here</Link> to register.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
