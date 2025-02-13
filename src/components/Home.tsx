import {Container, TextField} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Home  ()  {
    const [artist, setArtist] = useState("");
    const navigate = useNavigate();

    const searchArtist = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.code === "Enter"){
            navigate(`search?q=${artist}`);
        }
    }

    return (
        <Container sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh'}}>
            <Container sx={{
                width: '50vw',
                backgroundColor: 'white',
                padding: 5,
                display: 'flex',
                margin: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1em'
            }}>
                <TextField id="outlined-basic" label="Albums for artists" variant="outlined" fullWidth
                           onChange={(event) => setArtist(event.target.value)}
                           value={artist}
                           onKeyDown={(event) => searchArtist(event)}
                />
            </Container>
        </Container>
    )
}

export default Home;