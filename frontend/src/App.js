import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Header from "./components/Header";
import AddHouse from "./components/AddHouse";
import Login from "./components/Login";
import HouseDetails from "./components/HouseDetails";
import UserProfile from "./components/UserProfile";

function App() {

  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<AddHouse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/house/:id" element={<HouseDetails />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/*" element={<Main />} />
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
