import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import {
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  styled,
  Switch,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Copyright from "../components/Copyright";
import ThemeContext from "../components/ThemeContext";
import Headview3d from "react-headview3d";
import Skinview3d from "react-skinview3d";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [expire, setExpire] = useState("");
  const [skin, setSkin] = useState(name);
  const [updateTime, setUpdateTime] = useState("");
  const [registerTime, setRegisterTime] = useState("");
  const fileTypes = ["PNG"];

  const [file, setFile] = useState(null);

  const handleChange = (files) => {
    setFile(files);
  };

  const fileData = new FormData();

  const handleSkinFile = async () => {
    // const token = localStorage.getItem("token");
    // const decodedToken = jwt_decode(token);
    // const name = decodedToken.name
    // console.log(name);
    // console.log(decodedToken);

    if (file === null) {
      return console.log("file not loaded");
    } else {
      fileData.set("skin", file);
      fileData.set("name", name);
      const upload = await axios
        .post("http://localhost:5000/upload", fileData)
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
      // await axios.post("http://localhost:3002/api/upload", decodedToken)
    }
  };
  const navigate = useNavigate();

  const timeReg = async () => {
    try {
      const response = await axios.get("http://localhost:5000/time", {
        params: { email: email },
      });
      setUpdateTime(response.data.updatedAt);
      setRegisterTime(response.data.createdAt);
    } catch (error) {
      if (error.response) {
      }
    }
  };

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
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#FFD600" : "#FFD600",
    border: "none",
    boxShadow: "none",
    ...theme.typography.h6,
    textAlign: "left",
    color: "black",
  }));

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  const imageName = `${name}.png`;

  // const getImage = (imageName) => {
  //   const skin = new Image();
  //   skin.src = process.env.PUBLIC_URL + "/" + imageName;
  //   skin.onload = () => {
  //     setSkin(skin);
  //   };
  // };

  // skinLoader nie trogat`
  const getImage = (imageName) => {
    fetch(process.env.PUBLIC_URL + "/" + imageName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("File not found");
        }
        return response;
      })
      .then(() => {
        const skin = new Image();
        skin.src = process.env.PUBLIC_URL + "skins/" + imageName;
        skin.onload = () => {
          if (skin.width !== 64 || skin.height !== 64) {
            return alert("Загруженное изображение должно быть 64x64 пикселей!");
          }
          return setSkin(skin);
        };
        const defaultSkin = new Image();
        defaultSkin.src = process.env.PUBLIC_URL + "skins/default.png";
        defaultSkin.onload = () => {
          return setSkin(defaultSkin);
        };
      });
  };

  // const getImage = (imageName) => {
  //   const skin = new Image();
  //   skin.onerror = () => {
  //     // Загрузить default.png в случае ошибки загрузки изображения с именем игрока
  //     const defaultSkin = new Image();
  //     defaultSkin.src = process.env.PUBLIC_URL + '/default.png';
  //     defaultSkin.onload = () => {
  //       setSkin(defaultSkin);
  //     };
  //   };
  //   skin.src = process.env.PUBLIC_URL + '/' + imageName;
  //   skin.onload = () => {
  //     setSkin(skin);
  //   };
  // };
  useEffect(() => {
    refreshToken();
    // getUsers();
  }, []);

  useEffect(() => {
    getImage(imageName);
  }, [name]);

  useEffect(() => {
    timeReg();
  }, [email]);
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
        <Container maxWidth="xl">
          <Typography align="center" style={{ margin: "40px" }} variant="h4">
            {`Have a nice weekend, ${name}!`}
          </Typography>
          {/* <img src={skin.src} alt="" /> */}
          <Box
            style={{
              margin: "0 auto",
              borderRadius: "50px",
              padding: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              maxWidth: "80%",
            }}
            sx={{
              minHeight: 200,
              backgroundColor: "#FFD600",
            }}
          >
            <Box
              style={{
                borderRadius: "50%",
                background: "rgb(0 0 0 / 20%)",
                padding: "10px",
              }}
            >
              <Headview3d
                skinUrl={skin}
                height={128}
                width={128}
                // onReady={({ viewer }) => {}}
              />
            </Box>

            <Typography
              align="left"
              style={{ margin: "20px", color: "black" }}
              variant="h6"
            >
              {/* <Typography>
                Account registration .................
                {registerTime.substr(0, 10)}
              </Typography>
              <Typography>Last Activity................. {updateTime.substr(0, 10)}</Typography>
              <Typography>Account mail................. {email}</Typography> */}

              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <Item>Account registration</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item> {registerTime.substr(0, 10)}</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>Last Activity</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>{updateTime.substr(0, 10)}</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>Account mail</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>{email}</Item>
                </Grid>
              </Grid>

              <Box style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
                <Button
                  variant="contained"
                  style={{ color: "white", borderRadius: "100px" }}
                  color="secondary"
                >
                  Account mail
                </Button>
                <Button
                  variant="contained"
                  style={{ color: "white", borderRadius: "100px" }}
                  color="secondary"
                >
                  Change nickname{" "}
                </Button>
                <Button
                  variant="contained"
                  style={{ color: "white", borderRadius: "100px" }}
                  color="secondary"
                >
                  Change password
                </Button>
              </Box>
            </Typography>
          </Box>
          <Box marginTop={10}>
            <Typography
              align="center"
              style={{ margin: "0 auto" }}
              variant="h6"
              maxWidth={700}
            >
              <Typography variant="h3">Character appearance</Typography>
              <Typography variant="h6">
                Do you want to emphasize your individuality and look really
                cool? Personalize your game character and download a skin in
                just two clicks!
              </Typography>
            </Typography>

            <Box
              display={"flex"}
              // justifyContent={"space-around"}
              gap={10}
              marginBottom="100px"
              marginTop="100px"
              className="blocks"
              // margin={20}
            >
              <Box
                style={{
                  borderRadius: "50px",
                  padding: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
                sx={{
                  // minWidth: 650,
                  // minHeight: 500,
                  // maxHeight: 550,
                  backgroundColor: "#FFD600",
                  color: "black",
                }}
              >
                {/* <img src="/skin.png" alt="" /> */}
                <Skinview3d
                  skinUrl={skin}
                  // capeUrl={cape}
                  height="400"
                  width="200"
                  onReady={({ viewer }) => {
                    // viewer.globalLight.intensity = 0.6
                    // viewer.cameraLight.intensity = 0.4

                    // viewer.animation = Skinview3d.WalkingAnimation();
                    viewer.autoRotate = true;
                    viewer.controls.enablePan = false;
                    viewer.controls.enableRotate = true;
                    viewer.controls.enableZoom = false;
                    viewer.fov = 30;
                  }}
                />
                <Box textAlign={"left"}>
                  <Typography
                    align="center"
                    style={{ margin: "0 auto" }}
                    variant="h6"
                    maxWidth={700}
                  >
                    <Typography variant="h4">Skin</Typography>
                    <Typography variant="h6" marginBottom="50px">
                      All players can download skins in classic 64x64 pixel
                      resolution.
                      <br />{" "}
                      <i style={{ fontSize: "12px", color: "red" }}>
                        {" "}
                        Move the <a href="https://ru.namemc.com/">SKIN</a> to
                        the blue zone and press the button
                      </i>
                    </Typography>
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <FileUploader
                      maxSize={(1 / 1024) * 15}
                      height={1000}
                      handleChange={handleChange}
                      name="file"
                      types={fileTypes}
                    />
                    <Button
                      variant="contained"
                      style={{
                        borderRadius: "20px",
                        padding: "10px 30px",
                        fontWeight: "bold",
                      }}
                      color="error"
                      onClick={handleSkinFile}
                    >
                      Upload
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box
                style={{
                  borderRadius: "55px",
                  border: "3px solid #FFD600",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                // sx={{
                //   minWidth: 700,
                //   minHeight: 500,
                // }}
              >
                <Box style={{ padding: "40px" }}>
                  <Typography
                    variant="h4"
                    textAlign="center"
                    letterSpacing="5px"
                  >
                    <b>KILLACRAFT</b>
                  </Typography>
                  <Typography variant="h6" textAlign="justify">
                    Welcome to the killaCraft server! Here you can play
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
                    you. on our server.
                  </Typography>
                </Box>
                <Box
                  style={{
                    background: "#FFD600",
                    color: "black",
                    borderRadius: " 0px  0px 50px 50px",
                  }}
                >
                  <Typography
                    textAlign="center"
                    variant="h6"
                    style={{ padding: "20px", margin: "0px" }}
                  >
                    So if you feel like you need a break from all this hustle
                    and bustle, then you will find what you are looking for on
                    the killaCraft server. Enjoy the peace and beauty of the
                    Minecraft world with us!
                  </Typography>
                </Box>
              </Box>
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
