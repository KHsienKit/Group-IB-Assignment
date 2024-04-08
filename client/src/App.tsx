import React, {useEffect, useState, useRef} from "react";
import ReactRouter, { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Link, NavLink, Outlet} from "react-router-dom";

//Pages
import Main from "./Pages/Main"
import Settings from "./Pages/Settings"
import NavBar from "./Pages/NavBar"

//Router
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<NavBar />}>
            <Route index element={<Main />} />
            <Route path="settings" element={<Settings />} />
        </Route>
    )
)

const App = () => {
    return (
        <RouterProvider router={router} />
    )
};

export default App;