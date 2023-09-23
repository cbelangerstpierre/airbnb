import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


function Main() {
  return (
    <Container>
        <h1>Hello</h1>
    </Container>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3vh;
  height: 85vh;
`;