import { useState, useEffect } from "react";

export const s3url =
  "https://cbelangerstpierreairbnb.s3.ca-central-1.amazonaws.com/";

export const useFetchUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    let userId = null;
    cookies.forEach((cookie) => {
      const [name, value] = cookie.split("=");
      if (name === "user") {
        userId = value;
      }
    });

    if (userId) {
      fetch(`/api/get-user/${userId.slice(1, -1)}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data.user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return user;
};

/**
* Handles photo submission.
*
* @async
* @function
* @returns {Promise<string[]>} An array of photo URLs.
*/
export const handleSubmitPhoto = async (uploadedPhotos) => {
 const formDataPhotos = new FormData();

 uploadedPhotos.forEach((photo) => {
   formDataPhotos.append("files", photo);
 });

 const response = await fetch("/api/upload-images", {
   method: "POST",
   body: formDataPhotos,
 });

 const data = await response.json();
 return data.keys;
};

export const formatDate = (availabilities) => {
  return availabilities
    .map((date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    })
    .join(" - ");
};
