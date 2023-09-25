import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const PhotoUpload = ({ onPhotosUploaded }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onPhotosUploaded(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true
  });

  return (
    <DropzoneContainer {...getRootProps()}>
      <input name='images' {...getInputProps()} />
      <p>Drag & drop some photos here, or click to select files</p>
    </DropzoneContainer>
  );
};

const DropzoneContainer = styled.div`
  border: .2rem dashed #aaaaaa;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
`;

export default PhotoUpload;