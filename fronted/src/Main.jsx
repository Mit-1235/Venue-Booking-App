import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import InternationalLiveMatch from "./component/InternationalLiveMatch.jsx";
import LocalLiveScore from "./component/LocalLiveScore.jsx";
import MainContainer from "./component/MainContainer.jsx";
import Details from "./component/Details.jsx";
import Openers from "./component/Openers.jsx";
import Contact from "./component/Contact.jsx";
import Toss from "./component/Toss.jsx";
import BookVenue from "./Venue/BookVenue.jsx";
import Play from "./component/Play.jsx";
import Signin from "./component/Signin.jsx";
import Signup from "./component/Signup.jsx";
import Home from "./component/Home.jsx";
import AddVenue from "./Venue/AddVenue.jsx";
import ErrorBoundary from "./component/ErrorBoundary.jsx";
import RemoveVenue from "./Venue/RemoveVenue.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/international",
        element: <InternationalLiveMatch />,
      },
      {
        path: "/locallivescore",
        element: <LocalLiveScore />,
      },
      {
        path: "/details",
        element: <Details />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/MainContainer",
        element: <MainContainer />,
      },
      {
        path: "/openers",
        element: <Openers />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/toss",
        element: <Toss />,
      },
      {
        path: "/play",
        element: <Play />,
      },
      {
        path: "/venue", // Add the new route
        element: <BookVenue />,
      },
      {
        path: "/remove-venue",
        element: <RemoveVenue />,
      },
      {
        path: "/signin", // Add the new route
        element: <Signin />,
      },
      {
        path: "/signup", // Add the new route
        element: <Signup />,
      },
      {
        path: "/add-venue", // Add the new route
        element: <AddVenue/>,
      },
      { 
        path: "*", 
        element: <ErrorBoundary /> 
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>
);
