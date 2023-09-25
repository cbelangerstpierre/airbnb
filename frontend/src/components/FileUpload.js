import React, { useState, useEffect } from "react";

const FileUploadComponent = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
  
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    console.log(data); // Check the response from the server
  };

  return (
    <div>
      <h2>File Upload Component</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="files" multiple onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      <img
        src="http://localhost:5000/image/6510725d03bc472c40d3bc7f"
        alt="Uploaded Image"
      />
    </div>
  );
};

export default FileUploadComponent;
