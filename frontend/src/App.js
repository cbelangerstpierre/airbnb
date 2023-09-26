import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import AddHouse from "./components/AddHouse";
import Login from "./components/Login";
  
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    let userId = null;
    cookies.forEach(cookie => {
      const [name, value] = cookie.split("=");
      if (name === "user") {
        userId = value;
      }
    });

    if (userId) {
      fetch(`/api/get-user/${userId.slice(1, -1)}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUser(data.user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Root>
        <Header user={user}/>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<AddHouse />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

const Root = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;

export default App;