import './App.css'
import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { getUser } from './services/UserService';

//Assets
import { PersonSVG } from './assets/PersonSVG';
import { LogoutSVG } from './assets/LogoutSVG';
import { DashboardSVG } from './assets/DashboardSVG';

//All App Components
import { Hamburger } from './components/Hamburger/Hamburger';
import { ToastHandler } from './components/Toast/ToastHandler';

//Pages
import Dashboard from './components/Dashboard/Dashboard';
import { getFullUrl } from './services/ApiClient';

//Lazy loaded pages
const Login = React.lazy(() => import('./components/Authentication/Login'));
const Profile = React.lazy(() => import('./components/Profile/Profile'));


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

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<any>(null);

  const fetchUser = async () => {
    setUser(await getUser());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  });


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Hamburger>
        <Link to="/">
          <div style={linkContainerStyle}>
            <div style={svgContainerStyle}><DashboardSVG/></div>
            <div>Dashboard</div>
          </div>
        </Link>

        <div style={{margin:"auto"}}></div>

        {!user && (
          <Link to="/login">
            <div style={linkContainerStyle}>
              <div style={svgContainerStyle}><PersonSVG /></div>
              <div>Login</div>
            </div>
          </Link>
        )}
        {user && (<>
          <Link to="/profile">
            <div style={linkContainerStyle}>
              <div style={svgContainerStyle}><PersonSVG /></div>
              <div>{user.name}</div>
            </div>
          </Link>
          <a href={getFullUrl('auth/logout')}>
            <div style={linkContainerStyle}>
              <div style={svgContainerStyle}><LogoutSVG /></div>
              <div>Logout</div>
            </div>
          </a>
        </>)}
      </Hamburger>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile user={user}/>} />
          <Route path="*" element={<Dashboard user={user} />} />
        </Routes>
      </Suspense>

      <ToastHandler />
    </BrowserRouter>
  )
}

export default App
