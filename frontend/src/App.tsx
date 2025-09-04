import './App.css'
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Hamburger } from './components/Hamburger/Hamburger';
import { ToastHandler } from './components/Toast/ToastHandler';
import HelloWorld from './components/HelloWorld/HelloWorld';
function App() {
  const linkContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "end",
    marginRight: "5px",
  }

  const svgContainerStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    marginRight: "2px",
  }


  return (
    <BrowserRouter>
      <Hamburger>
        <Link to="/">
          <div style={linkContainerStyle}>
            <div style={svgContainerStyle}></div>
            <div>Hello World</div>
          </div>
        </Link>
      </Hamburger>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="*" element={<HelloWorld />} />
        </Routes>
      </Suspense>

      <ToastHandler />
    </BrowserRouter>
  )
}

export default App
