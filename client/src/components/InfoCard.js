import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, styled, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import HeadView3d from 'react-headview3d'
import { useNavigate } from 'react-router-dom';

const InfoCard = (props) => {

    const [updateTime, setUpdateTime] = useState("");
    const [registerTime, setRegisterTime] = useState("");
    const [skin, setSkin] = useState(props.name);

    const [emailNow, setEmailNow] = useState()
    const [newEmail, setNewEmail] = useState()
    const [newEmailConfirm, setNewEmailConfirm] = useState()
    const [openEmailForm, setOpenEmailForm] = React.useState(false);

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [openPasswordForm, setOpenPasswordForm] = React.useState(false);

    const [newNick, setNewNick] = useState('')
    const [openNickForm, setOpenNickForm] = React.useState(false);




    //Log out
    const navigate = useNavigate()

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }





    const imageName = `${props.name}.png`;
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
                        return alert("The uploaded image must be 64x64 pixels!");
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

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: 'inherit',
        border: "none",
        boxShadow: "none",
        ...theme.typography.h6,
        textAlign: "left",
        color: "black",
    }));


    //EMAIL CHANGER
    const handleClickOpenEmailForm = () => {
        setOpenEmailForm(true);
    };

    const handleCloseEmailForm = () => {
        setOpenEmailForm(false);
    };

    const handleEmailChange = (event) => {
        setNewEmail(event.target.value);
    };

    const handleEmailNowChange = (event) => {
        setEmailNow(event.target.value);
    };

    const handleEmailConfirmChange = (event) => {
        setNewEmailConfirm(event.target.value);
    };
    const handleEmailSubmit = async (e) => {
        try {
            if (newEmail !== newEmailConfirm) {
                alert("Password compare fail");
                return;
            }

            if (emailNow !== props.email) {
                alert("Enter your current email correctly");
                return;
            }
            if (newEmail === props.email) {
                alert("WTF R U DOING!?");
                return;
            }

            const response =await axios.post("http://localhost:5000/emailchange", {
                email: props.email,
                newEmail: newEmail,
            });

            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    //PASSWORD CHANGER
    const handleClickOpenPassForm = () => {
        setOpenPasswordForm(true);
    };

    const handleClosePassForm = () => {
        setOpenPasswordForm(false);
    };

    const handlePassChange = (event) => {
        setNewPassword(event.target.value);
    };
    const handlePassConfirmChange = (event) => {
        setNewPasswordConfirm(event.target.value);
    };
    const handlePasswordChange = async () => {
        try {
            if (newPassword !== newPasswordConfirm) {
                return alert('Password compare fail')
            }
            if (newPassword.length >= 20) {
                return alert('Your password is too long (max 20)')
            }
            if (newPassword.length < 6) {
                return alert('Your password is too short (min 6)')
            }
            
            const response =await axios.post("http://localhost:5000/passwordchange", {
                email: props.email,
                newPassword: newPassword,
            })
            alert(response.data.message);
            Logout()

        } catch (error) {
            console.log('Password change fail')
        }
    };

    //NAME CHANGER
    const handleClickOpenNickForm = () => {
        setOpenNickForm(true);
    };

    const handleCloseNickForm = () => {
        setOpenNickForm(false);
    };

    const handleNickChange = (event) => {
        setNewNick(event.target.value);
    };
    const NickChange = async () => {
        try {
            if (newNick === props.name) { return alert('WTF R U DOING!?') }
            if (newNick.length > 20) { return alert('Your nickname is too long (max 20)') }
           const response = await axios.post("http://localhost:5000/namechange", {
                email: props.email,
                newName: newNick,
            })
            alert(response.data.message)
            handleCloseNickForm()
            window.location.reload();

        } catch (error) {
            console.log(error)
        }
    };

    //get time
    const timeReg = async () => {
        try {
            const response = await axios.get("http://localhost:5000/time", {
                params: { email: props.email },
            });
            setUpdateTime(response.data.updatedAt);
            setRegisterTime(response.data.createdAt);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        timeReg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.email]);


    useEffect(() => {
        getImage(imageName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.name]);
    return (
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

            <Dialog open={openEmailForm} onClose={handleCloseEmailForm}>
                <DialogTitle>E-MAIL CHANGE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to change your e-mail write...
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address NOW"
                        type="email"
                        fullWidth
                        variant="outlined"
                        onChange={handleEmailNowChange}
                        value={emailNow}
                    />
                    <TextField

                        margin="dense"
                        id="name"
                        label="Email Address DESIRED"
                        type="email"
                        fullWidth
                        variant='outlined'
                        onChange={handleEmailChange}
                        value={newEmail}
                    />
                    {/* Проверка на валидность мейла */}
                    <TextField
                        // onChange={setNewEmailConfirm((e) => e.target.value)}
                        margin="dense"
                        id="name"
                        label="Email Address REPEAT DESIRED EMAIL"
                        type="email"
                        fullWidth
                        variant="outlined"
                        onChange={handleEmailConfirmChange}
                        value={newEmailConfirm}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEmailForm}>Cancel</Button>
                    <Button onClick={handleEmailSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openPasswordForm} onClose={handleClosePassForm}>
                <DialogTitle>PASSWORD CHANGE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to change your e-mail write...
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Your new password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        onChange={handlePassChange}
                        value={newPassword}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Confirm your password"
                        type="password"
                        fullWidth
                        variant='outlined'
                        onChange={handlePassConfirmChange}
                        value={newPasswordConfirm}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePassForm}>Cancel</Button>
                    <Button onClick={handlePasswordChange}>Submit</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openNickForm} onClose={handleCloseNickForm}>
                <DialogTitle>PASSWORD CHANGE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to change your e-mail write...
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Your new nickname"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={handleNickChange}
                        value={newNick}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNickForm}>Cancel</Button>
                    <Button onClick={NickChange}>Submit</Button>
                </DialogActions>
            </Dialog>
            <Box
                style={{
                    borderRadius: "50%",
                    background: "rgb(0 0 0 / 20%)",
                    padding: "10px",
                }}
            >
                <HeadView3d skinUrl={skin} height={128} width={128} />
            </Box>

            <Typography
                align="left"
                style={{ margin: "20px", color: "black" }}
                variant="h6"
            >
                <Grid
                    style={{marginLeft:'50px'}}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Grid item xs={5}>
                        <Item>Account registration</Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item> {registerTime.substr(0, 10)}</Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item>Last Activity</Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item>{updateTime.substr(0, 10)}</Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item>Account mail</Item>
                    </Grid>
                    <Grid item xs={5}>
                        <Item>{props.email}</Item>
                    </Grid>
                </Grid>

                <Box style={{ display: "flex", gap: "40px", marginTop: "30px", marginLeft:'100px'}}>
                    <Button
                        variant="contained"
                        style={{ color: "white", borderRadius: "100px" }}
                        color="secondary"
                        onClick={handleClickOpenEmailForm}
                    >
                        Account mail
                    </Button>
                    <Button
                        variant="contained"
                        style={{ color: "white", borderRadius: "100px" }}
                        color="secondary"
                        onClick={handleClickOpenNickForm}
                    >
                        Change nickname{" "}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ color: "white", borderRadius: "100px" }}
                        color="secondary"
                        onClick={handleClickOpenPassForm}
                    >
                        Change password
                    </Button>
                </Box>
            </Typography>
        </Box>
    )
}

export default InfoCard