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
