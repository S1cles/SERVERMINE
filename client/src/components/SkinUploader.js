import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import Skinview3d from "react-skinview3d";



const SkinUploader = (props) => {
    const [file, setFile] = useState(null);
    const [skin, setSkin] = useState(props.name);
    const fileTypes = ["PNG"];

      //SKINLOAD
  const fileData = new FormData();

  const handleChange = (files) => {
    setFile(files);
  };

  const handleSkinFile = async () => {
    if (file === null) {
      return console.log("file not loaded");
    } else {
      fileData.set("skin", file);
      fileData.set("name", props.name);
      await axios
        .post("http://localhost:5000/upload", fileData)
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };




  //3DSKINLOADER
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


  useEffect(() => {
    getImage(imageName);
  }, [props.name]);


  return (
    <Box
    style={{
      borderRadius: "50px",
      padding: "40px",
      display: "flex",
      alignItems: "center",
    }}
    sx={{
      backgroundColor: "#FFD600",
      color: "black",
    }}
  >
    <Skinview3d
      skinUrl={skin}
      height="400"
      width="200"
      onReady={({ viewer }) => {
        viewer.autoRotate = true;
        viewer.controls.enablePan = false;
        viewer.controls.enableRotate = true;
        viewer.controls.enableZoom = false;
        viewer.fov = 30;
      }}
    />
    <Box textAlign={"left"}>
      <Box
        align="center"
        style={{ margin: "0 auto" }}
        maxWidth={700}
      >
        <Typography variant="h4">Skin</Typography>
        <Typography variant="h6" marginBottom="50px">
          All players can download skins in classic 64x64 pixels
          resolution.
          <br />{" "}
          <i style={{ fontSize: "12px", color: "red" }}>
            {" "}
            Move the <a target='blank' href="https://ru.namemc.com/">SKIN</a> to
            the blue zone and press the button
          </i>
        </Typography>
      </Box>
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
  )
}

export default SkinUploader