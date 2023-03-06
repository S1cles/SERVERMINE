import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Switch,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Copyright from "../components/Copyright";
import ThemeContext from "../components/ThemeContext";
import SkinUploader from "../components/SkinUploader";
import Card from "./../components/Card";
import InfoCard from "../components/InfoCard";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [expire, setExpire] = useState("");

  const cardText1 = `Welcome to the killaCraft server! Here you can play
Minecraft and enjoy all the delights of survival in the
blocky world. Our server offers a large number interesting
game modes and opportunities for players of all experience
levels. However, sometimes it happens that you just I need
to take a break from all this. You can just wander around
the world, contemplating the beauty of nature and enjoying
peace. This can be a real treat and let you relax and
disconnect from everything else. On server killaCraft you
can find many peaceful places where you can enjoy this
simplicity. Build yourself a comfortable house, immerse
yourself in reading books or just sit by the fire, listening
to the sound of the rain. All this and more is available to
you. on our server.`;
  const cardText2 = `So if you feel like you need a break from all this hustle
and bustle, then you will find what you are looking for on
the killaCraft server. Enjoy the peace and beauty of the
Minecraft world with us!`;

  const navigate = useNavigate();

  //JWT
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setEmail(decoded.email);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //MUI

  const [darkMode, setDarkMode] = useState(false);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#F44336",
      },
      secondary: {
        main: "#D32F2F",
      },
    },
  });

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#FFD600",
      },
      secondary: {
        main: "#ef6c00",
        contrastText: "#ffcc00",
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={darkMode ? darkTheme : theme}>
        <FormControlLabel
          style={{ float: "right" }}
          color="black"
          control={
            <Switch checked={darkMode} onChange={handleDarkModeChange} />
          }
          label="Dark Mode"
        />
        <br />
        <Container className="dashboard" maxWidth="xl">
          <Typography align="center" style={{ margin: "40px" }} variant="h4">
            {`Have a nice weekend, ${name}!`}
          </Typography>
          <InfoCard email={email} name={name} />
          <Box marginTop={10}>
            <Box align="center" style={{ margin: "0 auto" }} maxWidth={700}>
              <Typography variant="h3">Character appearance</Typography>
              <Typography variant="h6">
                Do you want to emphasize your individuality and look really
                cool? Personalize your game character and download a skin in
                just two clicks!
              </Typography>
            </Box>

            <Box
              display={"flex"}
              gap={10}
              marginBottom="100px"
              marginTop="100px"
              className="blocks"
            >
              <SkinUploader name={name} />
              <Card
                title={"KILLACRAFT"}
                first_text={cardText1}
                second_text={cardText2}
              />
            </Box>
          </Box>
        </Container>
        <footer>
          <CssBaseline />
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: "auto",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
            }}
          >
            <Container align={"center"}>
              <Typography>killaCRAFT LETS PLAY TOGETHER</Typography>
              <Copyright />
            </Container>
          </Box>
        </footer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Dashboard;
