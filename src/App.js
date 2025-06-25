import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { UserProvider } from './UserContext';
import AppNavbar from "./components/AppNavbar";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import Post from "./pages/PostPage";
import Error from "./pages/Error";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  const fetchUserData = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data._id && typeof data.isAdmin !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
        } else {
          setUser({ id: null, isAdmin: null });
        }
      })
      .catch(err => {
        console.error("User fetch error:", err.message);
        setUser({ id: null, isAdmin: null });
      });
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserProvider value={{ user, fetchUserData, setUser }}>
      <Router>
        <AppNavbar />
        <Container fluid className="app-bg py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts/:postId" element={<PostDetails />} />
            <Route path="/post" element={<Post />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
