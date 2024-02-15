// import React from "react";

// const Footer = () => {
//   return (
//     <footer
//       className="footer justify-between p-4 text-white"
//       style={{
//         backgroundColor: "#000022ff",
//         borderTopWidth: 0.2,
//         borderColor: "white",
//         flex: "0 0 auto",
//       }}
//     >
//       <aside className="items-center grid-flow-col">
//         <p>Copyright © Wodkafisch 2023 </p>
//       </aside>
//       {/* <nav className="grid-flow-col items-center 'hover:bg-blue-400">
//         <a
//           href="https://www.linkedin.com/in/julian-hay-8aab34161/"
//           target="_blank"
//           style={{
//             height: 30,
//             width: 30,
//             backgroundColor: "#3d3d3d",
//             borderRadius: 50,
//             alignItems: "center",
//             justifyContent: "center",
//             display: "flex",
//             transition: "background-color 0.3s",
//           }}
//         >
//           <svg
//             style={{ fill: "white" }}
//             xmlns="http://www.w3.org/2000/svg"
//             height="1em"
//             viewBox="0 0 448 512"
//           >
//             <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
//           </svg>
//         </a>
//       </nav> */}
//       <nav className="grid-flow-col items-center">
//         <a href="/privacy_policy">Privacy Policy</a>
//         <a href="/terms_and_conditions">Terms and Conditions</a>
//       </nav>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000022ff",
        borderTopWidth: 0.2,
        borderColor: "white",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p>Copyright © Wodkafisch 2023 </p>
        </div>

        <div>
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/terms-and-conditions">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
