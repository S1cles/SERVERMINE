import React, { useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  Box, Button, Container, Fab, Stack,  Toolbar, Typography } from '@mui/material';
import ThemeContext from './ThemeContext';
const Navbar = () => {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout');
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `Launcher.exe`;
    link.href = "/Launcher.exe";
    link.click();
  };
  const { darkMode } = useContext(ThemeContext);

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      <Container
        maxWidth="xl"
        style={{ display: "flex", justifyContent: "space-between" , padding:'10px'}}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src='/moai64.png' alt="logo" style={{ transform: "rotate(350deg)" }} />
            <img src="/logo.png" alt="logo" style={
              {
                filter:
                  " drop-shadow(16px 16px 50px white)  brightness(1.3) ",
              }

            } />
          </Typography>

        </Toolbar>

        <Toolbar >

          <Stack
            direction="row"
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: 'center',
              margin: '10px',
              gap:'10px'
            }}
          >
            <Fab
              variant="extended"
              size="medium"
              color='warning'
              aria-label="add"
              onClick={onDownload}
            >
              <img src="/moai.png" width={50} alt="" />
              Launcher
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="error"
              aria-label="add"
              href="https://download.oracle.com/java/17/archive/jdk-17.0.6_windows-x64_bin.exe"
            >
              <img src="/Java.png" width={50} alt="" />
              Java
            </Fab>
          </Stack>
          <Box sx={{ flexGrow: 0 }}>
            <Button variant="outlined" color="error" onClick={Logout}>
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </ThemeContext.Provider>
  )
}

export default Navbar