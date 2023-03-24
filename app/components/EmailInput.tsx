"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function EmailInput() {
  // Initialize the email state variable to an empty string
  const [email, setEmail] = useState("");
  // Initialize the error message state variable to an empty string
  const [errorMessage, setErrorMessage] = useState("");

  // Use the useQuery hook to fetch data from the API endpoint
  const { data } = useQuery(
    // The first argument to useQuery is an array that defines the query key
    ["checkEmail", email],
    // The second argument is an async function that fetches the data
    async () => {
      // Send a POST request to the "/api/checkEmail" endpoint with the email in the body
      const response = await fetch("/api/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      // Parse the response JSON data and return it
      const data = await response.json();
      return data;
    },
    // The third argument is an options object that enables or disables the query
    {
      enabled: Boolean(email),
    }
  );

  // Define a function to handle the input box blur event
  const handleBlur = async () => {
    // Check if the email is not empty
    if (email) {
      // Send a POST request to the "/api/checkEmail" endpoint with the email in the body
      const response = await fetch("/api/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      // Parse the response JSON data
      const data = await response.json();
      // If the data has an error property, set the error message state variable to its value
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        // Otherwise, set the error message state variable to an empty string
        setErrorMessage("");
      }
    }
  };

  // Return the JSX for the component
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
        Email:
      </label>
      <input
        // Add Tailwind CSS classes to style the input box
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errorMessage ? "border-red-500" : ""
        } focus:ring focus:ring-blue-300 focus:border-blue-500`}
        id="email"
        type="email"
        placeholder="Email"
        // Bind the email state variable to the value of the input box
        value={email}
        // Define a function to handle the input box change event
        onChange={(event) => setEmail(event.target.value)}
        // Define a function to handle the input box blur event
        onBlur={handleBlur}
      />
      {/* If the error message state variable is not empty, display the error message */}
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}

// Export the EmailInput component as the default export of the module
export default EmailInput;

// function EmailInput() {
//   const [email, setEmail] = useState("");
//   const { data, isLoading } = useQuery(
//     ["checkEmail", email],
//     async () => {
//       const response = await fetch("/api/checkEmail", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       return data;
//     },
//     {
//       enabled: Boolean(email),
//     }
//   );

//   const errorMessage = data?.error;

//   return (
//     <>
//       <label>
//         Email:
//         <input
//           type="email"
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//           onBlur={() => {
//             if (!isLoading && errorMessage) {
//               alert(errorMessage);
//             }
//           }}
//         />
//       </label>
//       {isLoading && <p>Loading...</p>}
//     </>
//   );
// }

// export default EmailInput;
