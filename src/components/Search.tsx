import {Box, Button, Container, TextField} from "@mui/material";
import {useState} from "react";
import processArtist from "../services/artists.ts";
import Album from "../types/Album.ts";


function Search () {
    const [searchArtist, setSearchArtist] = useState("");
    const [albums, setAlbums] = useState<Album[]>([]);

    const handleSearchArtist = async () => {
        const result = await processArtist(searchArtist);
        setAlbums(result);
    }

    return (
        <Box sx={{bgcolor: 'white', height: '100vh', width: '100vw'}}>
            <Box sx={{height: '5vh'}}>

            </Box>
            <Container maxWidth={"sm"} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TextField value={searchArtist}
                           onChange={(event) => setSearchArtist(event.target.value)}
                           id="standard-basic"
                           fullWidth
                           label="Artist"
                           variant="outlined" />
            </Container>
            <Container maxWidth={"sm"} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Button variant="contained" onClick={handleSearchArtist}>Search (Artist Only)</Button>
            </Container>
        </Box>
)
}

export default Search