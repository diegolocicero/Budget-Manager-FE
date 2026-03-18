import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient.ts";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import Home from "./pages/home/Home.tsx";
import Header from "./components/header/header.tsx";
import BackgroundCircles from "./components/BackgroundCirclesComponent.tsx";
import Profile from "./pages/profile/Profile.tsx";

function AnimatedRoutes() {
  const location = useLocation();

  const showHeader = !["/", "/signup"].includes(location.pathname);

  const getPositions = (path: string) => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Connessione Supabase attiva:", data);
    });
    if (path === "/signup") {
      return [
        { x: "15vw", y: "10vh", size: 400 },
        { x: "75vw", y: "90vh", size: 350 },
        { x: "50vw", y: "20vh", size: 250 },
        { x: "10vw", y: "80vh", size: 300 },
        { x: "80vw", y: "15vh", size: 450 },
      ];
    }
    if (path === "/") {
      return [
        { x: "5vw", y: "15vh", size: 400 },
        { x: "65vw", y: "60vh", size: 350 },
        { x: "30vw", y: "30vh", size: 250 },
        { x: "20vw", y: "70vh", size: 300 },
        { x: "70vw", y: "-20vh", size: 450 },
      ];
    }
    return [
      { x: "10vw", y: "20vh", size: 400 },
      { x: "70vw", y: "50vh", size: 350 },
      { x: "40vw", y: "40vh", size: 250 },
      { x: "30vw", y: "80vh", size: 300 },
      { x: "80vw", y: "10vh", size: 450 },
    ];
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {showHeader && <Header />}
      <BackgroundCircles positions={getPositions(location.pathname)} />
      <Routes location={location}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;