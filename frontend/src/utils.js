import { useState, useEffect } from "react";

/**
 * The base URL for S3 storage.
 * @type {string}
 */
export const s3url =
  "https://cbelangerstpierreairbnb.s3.ca-central-1.amazonaws.com/";

/**
 * Custom hook that fetches user data from the server.
 * @returns {object|null} The user data, or null if user is not logged in.
 */
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
 * Function to handle photo submission.
 * @param {File[]} uploadedPhotos - An array of uploaded photos.
 * @returns {Promise<string[]>} A Promise that resolves to an array of photo URLs.
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

/**
 * Formats an array of date strings into a human-readable date range.
 * @param {string[]} availabilities - An array of date strings.
 * @returns {string} A formatted date range string (e.g., "Jan 1 - Jan 5").
 */
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
