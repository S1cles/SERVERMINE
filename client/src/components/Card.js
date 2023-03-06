import { Box, Typography } from '@mui/material'
import React from 'react'

const Card = (props) => {
    return (
        <Box
            style={{
                borderRadius: "55px",
                border: "3px solid #FFD600",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
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
                    {props.first_text}
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
                    {props.second_text}
                </Typography>
            </Box>
        </Box>
    )
}

export default Card