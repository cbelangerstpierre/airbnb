import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import AddHouse from "./components/AddHouse";
import Login from "./components/Login";
import HouseDetails from "./components/HouseDetails";

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
          <Route path="/profile/:id" element={<Login />} />
          {/* TODO change to the real component */}
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
