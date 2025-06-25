import { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/register`,{
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
      	  username: username,
          email: email,
          password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.message === "Registered Successfully"){
        Swal.fire({
                title: "Registration Successful",
                icon: "success",
                text: "Thank you for registering!"
        });

        setUsername("");
        setEmail("");
        setPassword("");

        navigate('/login');
      }else{
        Swal.fire({
                title: "Something went wrong.",
                icon: "error",
                text: "Please try again later or contact us for assistance"
        });
      }
    })
  }

  useEffect(() => {
    if (
      username !== "" && email !== "" && email.includes("@") && password.length >=8
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [username, email, password]);

  return (
    <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <h1 className="text-center mb-4">Register</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={registerUser}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control 
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control 
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control 
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {
                    isActive
                    ? <Button variant="primary" type="submit" className="w-100">Submit</Button>
                    : <Button variant="danger" type="submit" className="w-100" disabled>Please enter your registration details</Button>
                  }
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}