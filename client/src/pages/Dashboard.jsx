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
    
    if(file===null){
     return console.log('file not loaded')
    }else{
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
      const response = await axios.get("http://localhost:5000/time",{params:{email:email}});
      setUpdateTime(response.data.updatedAt)
      setRegisterTime(response.data.createdAt)
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
    fetch(process.env.PUBLIC_URL + '/' + imageName)
      .then(response => {
        if (!response.ok) {
          throw new Error('File not found');
        }
        return response;
      })
      .then(() => {
        const skin = new Image();
        skin.src = process.env.PUBLIC_URL + 'skins/' + imageName;
        skin.onload = () => {
          return setSkin(skin);
        };
        const defaultSkin = new Image();
        defaultSkin.src = process.env.PUBLIC_URL + 'skins/default.png';
        defaultSkin.onload = () => {
          return setSkin(defaultSkin);
        };
      })
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
  
  useEffect(()=>{
    timeReg()
  },[email])
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
        <Container>
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
            }}
            sx={{
              minHeight: 200,
              backgroundColor: "#FFD600",
            }}
          >
            <div
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
            </div>

            <Typography
              align="left"
              style={{ margin: "20px", color: "black" }}
              variant="h6"
            >
              <p>
                Account registration .................{registerTime.substr(0, 10)}
              </p>
              <p>Last Activity................. {updateTime.substr(0, 10)}</p>
              <p>Account mail................. {email}</p>
              <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
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
              </div>
            </Typography>
          </Box>
          <Box marginTop={10}>
            <Typography
              align="center"
              style={{ margin: "0 auto" }}
              variant="h6"
              maxWidth={700}
            >
              <p>Character appearance</p>
              <p>
                Do you want to emphasize your individuality and look really
                cool? Personalize your game character and download a skin in
                just two clicks!
              </p>
              <Box
                display={"flex"}
                justifyContent={"space-around"}
                gap={50}
                margin={20}
              >
                <Box
                  style={{
                    borderRadius: "50px",
                    padding: "40px",
                    display: "flex",
                  }}
                  sx={{
                    minWidth: 650,
                    minHeight: 500,
                    maxHeight: 550,
                    backgroundColor: "#FFD600",
                    color: "black",
                  }}
                >
                  {/* <img src="/skin.png" alt="" /> */}
                  <Skinview3d
                    skinUrl={skin}
                    // capeUrl={cape}
                    height="400"
                    width="300"
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
                    <h3>Skin</h3>
                    <p>
                      All players can download skins in classic 64x64
                      resolution.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
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
                      <FileUploader
                        maxSize={((1/1024)*15)}
                        height={500}
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}
                      />
                      <Button
                        variant="contained"
                        style={{ borderRadius: "100px" }}
                        color="inherit"
                      >
                        {/* <FileDownloadIcon /> */}
                      </Button>
                      <Button
                        variant="contained"
                        style={{ borderRadius: "100px" }}
                        color="inherit"
                      >
                        {/* <DeleteForeverIcon /> */}
                      </Button>
                    </div>
                  </Box>
                </Box>
                <Box
                  style={{
                    borderRadius: "55px",
                    border: "3px solid #FFD600",
                  }}
                  sx={{
                    minWidth: 700,
                    minHeight: 500,
                  }}
                >
                  <div style={{ padding: "40px" }}>
                    <h3>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </h3>
                    <p>
                      Nuncvulputate libero et velit interdum, ac aliquet odio
                      mattis. Class aptent taciti sociosqu ad litora torquent
                      per conubia nostra, per inceptos himenaeos.consectetur
                      adipiscing elit. Nunc vulputate libero et velit interdum,
                      ac aliquet odio mattis. Class aptent taciti sociosqu ad
                      litora torquent per conubia nostra, per inceptos
                      himenaeos. consectetur adipiscing elit. Nunc vulputate
                      libero et velit interdum, ac aliquet odio mattis. Class
                      aptent taciti sociosqu ad litora torquent per conubia
                      nostra, per inceptos himenaeos.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#FFD600",
                      color: "black",
                      borderRadius: " 0px  0px 50px 50px",
                    }}
                  >
                    <h3>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </h3>
                    <p style={{ padding: "0px", margin: "0px" }}>
                      Nunc vulputate libero et velit interdum, ac aliquet odio
                      mattis. Class aptent taciti sociosqu ad litora torquent
                      per conubia nostra, per inceptos himenaeos.
                    </p>
                  </div>
                </Box>
              </Box>
            </Typography>
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
