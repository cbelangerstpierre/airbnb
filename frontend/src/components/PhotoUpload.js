import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const PhotoUpload = ({ onPhotosUploaded }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the uploaded files
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
  border: 2px dashed #cccccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

export default PhotoUpload;