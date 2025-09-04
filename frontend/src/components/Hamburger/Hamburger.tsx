import React, { useState, useLayoutEffect } from 'react';
import { MenuSVG } from '../../assets/MenuSVG'

interface HamburgerProps {
  children?: React.ReactNode;
}

export const Hamburger: React.FC<HamburgerProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [width, setWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });

  const hamburgerWideStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 100
  }

  if (width > 768) {
    return (
      <div style={hamburgerWideStyle}>
        {children}
      </div>
    )
  }

  const hamburgerThinStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "24px",
    height: "24px",
    padding: "4px",
  }

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "40%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  }

  const offClickBlockStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: "40%",
    width: "60%",
    height: "100%",
    zIndex: 50,
  }

  const innerDrawerStyle: React.CSSProperties = {
    position: "fixed",
    left: "32px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
  }

  const childStyling: React.CSSProperties = {
    marginBottom: "8px",
  }

  return (
    <div>
      {!drawerOpen && (
        <div
          style={hamburgerThinStyle}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <MenuSVG />
        </div>
      )}
      {drawerOpen && (
        <>
        <div style={drawerStyle}>
          <div
            style={hamburgerThinStyle}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuSVG />
          </div>
          <div style={innerDrawerStyle}>
            {children && Array.isArray(children) && children.map((child, index) => (
              <div style={childStyling} key={index}>{child}</div>
            ))}
          </div>
        </div>
        <div style={offClickBlockStyle} onClick={() => setDrawerOpen(!drawerOpen)}/>
        </>
      )}
    </div>
  );
}

//<a target="_blank" href="https://icons8.com/icon/106562/github">GitHub</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>