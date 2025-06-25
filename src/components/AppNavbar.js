import {useContext} from "react";
import UserContext from "../UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink, Link, useNavigate} from 'react-router-dom';

export default function AppNavbar() {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();

  console.log("user:",  user);

  const logout = () => {
    localStorage.removeItem('token');
    setUser({ id: null });
    navigate('/login');
  };

  return (
    <Navbar expand="md" className="bg-body-tertiary fixed-top">
      <Container fluid>
        <Navbar.Brand as={Link} to='/'><b>BlogPost</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.id !== null
            ?
            <>
              {user.isAdmin === true
              ?
                <>
                  <Nav.Link as={NavLink} to="/dashboard" className="text-white">Dashboard</Nav.Link>
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </>
              :
                <>
                  <Nav.Link as={NavLink} to='/profile'>Profile</Nav.Link>
                  <Nav.Link as={NavLink} to='/post'>Add Post</Nav.Link>
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </>
              }
            </>
            :
            <>
              <Nav.Link as={NavLink} to='/login'>Login</Nav.Link>
              <Nav.Link as={NavLink} to='/register'>Register</Nav.Link>              
            </>
          }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
