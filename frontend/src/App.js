import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Header from "./components/Header";
import AddHouse from "./components/AddHouse";
  
function App() {
  return (
    <BrowserRouter>
      <Root>
        <Header user={{name: "Cédric Bélanger-St-Pierre", profilePhoto: "profile.png"}}/>
        {/* <Header user={null}/> */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<AddHouse />} />
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

const Root = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  // background-color: black;
  min-height: 100vh;
`;

export default App;






const addItem = async () => {
    try {
      const response = await fetch('/api/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };