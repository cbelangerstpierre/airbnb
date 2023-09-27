import React from "react";
import styled from "styled-components";
import { s3url } from "../utils";
import { useNavigate } from "react-router-dom";

const HostPreview = ({ host }) => {
    const navigate = useNavigate();

  if (host === null) {
    return <></>;
  }
  return (
    <Host>
      <Avatar src={`${s3url}${host.photo}`} alt={"avatar"} onClick={() => {navigate(`/user/${host._id}`)}}/>
      <HostInformation>
        <HostName>Hosted by {host.fullName}</HostName>
        <TimeHosted>{new Date().getFullYear() - new Date(host.userCreatedDate).getFullYear()} year hosting</TimeHosted>
      </HostInformation>
    </Host>
  );
};

const Host = styled.div`
  display: flex;
  gap: 2rem;
`;

const HostName = styled.h4`
  font-size: 1.1rem;
  margin: 0;
`;

const TimeHosted = styled.p`
color: grey;
margin: 0;
`;

const HostInformation = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
`;

export default HostPreview;
