"use client";

import { useEffect } from "react";

export default function Hash404() {

  useEffect(() => {

    if (
      window.location.hash
    ) {

      document.body.innerHTML = `
        <div style="
          width:100%;
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:white;
          font-size:48px;
          font-weight:900;
        ">
          404 Not Found
        </div>
      `;

    }

  }, []);

  return null;

}