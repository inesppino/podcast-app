import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Home from "./pages/home/index.jsx";
import Podcast from "./pages/podcast-detail/index.jsx";
import Layout from "./components/layout/index.jsx";
import Episode from "./pages/episode/index.jsx";
import "./styles/globals.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "podcast/:podcastId",
    element: <Podcast />,
  },
  {
    path: "podcast/:podcastId/episode/:episodeId",
    element: <Episode />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </Provider>
  </React.StrictMode>
);
