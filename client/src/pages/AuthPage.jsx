import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Copyright from "../components/Copyright";

const onDownload = () => {
  const link = document.createElement("a");
  link.download = `Launcher.exe`;
  link.href = "/Launcher.exe";
  link.click();
};

const AuthPage = () => {
  const [msg, setMsg] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const creator = "http://localhost:5000/users";
  const loginator = "http://localhost:5000/login";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#F44336",
      },
      secondary: {
        main: "#f48fb1",
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
      },
    },
  });

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    const formUpdated = { ...formData, name: "" };
    try {
      await axios.post(
        newUser ? creator : loginator,
        newUser ? formData : formUpdated
      );
      newUser ? handleClickOpen() : navigate("/dashboard");
      setNewUser(false);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };
  const handleCreateAccountChange = (event) => {
    setNewUser(event.target.checked);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center" }}
          >
            💖💖💖Congratilations💖💖💖 <br />
            Your accoint has been created!
            <br />
            <br />
            Now you can download our launcher!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Yes sir!
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://blog.yiningkarlli.com/content/images/2016/Jul/aerial_shot_final_comp.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Stack
            direction="row"
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="add"
              onClick={onDownload}
            >
              <img src="/moai.png" width={50} alt="" />
              Launcher
            </Fab>
            <FormControlLabel
              control={
                <Switch checked={darkMode} onChange={handleDarkModeChange} />
              }
              label="Dark Mode"
            />
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

          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <img
              style={
                darkMode
                  ? {
                      filter:
                        "hue-rotate(300deg)  drop-shadow(16px 16px 50px white)",
                    }
                  : { filter: " brightness(1.3)" }
              }
              src="/logo.png"
              alt=""
            />
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={newUser}
                    onChange={handleCreateAccountChange}
                  />
                }
                label="Create new account"
              />
            </div>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Controller
                name="name"
                control={control}
                aria-invalid={errors.name ? "true" : "false"}
                rules={{
                  minLength: 2,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.-]*$/,
                }}
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    name="name"
                    label="Name"
                    type="text"
                    helperText="[A-Z] and [0-9]"
                    id="name"
                    style={
                      newUser
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                    }
                    autoFocus
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                rules={{
                  required: true,
                  // eslint-disable-next-line no-useless-escape
                  pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                }}
                control={control}
                aria-invalid={errors.email ? "true" : "false"}
                render={({ field }) => (
                  <TextField
                    // error={formData.email.length === 0 ? false : true}
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    {...field}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                aria-invalid={errors.email ? "true" : "false"}
                rules={{ required: true, minLength: 6, maxLength: 20 }}
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    helperText="minimum:6 - maximum:20"
                    autoComplete="current-password"
                    {...field}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                // style={
                //     darkMode
                //         ? { filter: "hue-rotate(500deg)" }
                //         : { filter: "none" }
                // }
              >
                {newUser ? "Sign In" : "Log in"}
              </Button>
              {errors.email && (
                <p style={{ fontSize: "24px", color: "red" }} role="alert">
                  <h4>Enter your real email!!!</h4>
                </p>
              )}
              {errors.password && (
                <p style={{ fontSize: "24px", color: "red" }} role="alert">
                  <h6>Incorrect validation password</h6>
                </p>
              )}
              {msg && (
                <h3 style={{ color: "red", border: "solid 2px red" }}>{msg}</h3>
              )}

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default AuthPage;
