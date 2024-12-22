import {Box, Button, Container, TextField} from "@mui/material";
import {useState} from "react";
import fetchLyrics from "../services/lyrics.ts";
import fetchArtist from "../services/artists.ts";

function Search () {
    const [searchTitle, setSearchTitle] = useState("");
    const [searchArtist, setSearchArtist] = useState("");
    const [lyrics, setLyrics] = useState("");

    const handleSearch = async () => {
        setSearchTitle("");
        setSearchArtist("");
        const lyricsResponse = await fetchLyrics(searchTitle, searchArtist);
        setLyrics(lyricsResponse.lyrics.plainLyrics)
        console.log(lyricsResponse)
    };

    const handleSearchArtist = async () => {
        await fetchArtist(searchArtist);
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
                <TextField value={searchTitle}
                           onChange={(event) => setSearchTitle(event.target.value)}
                           id="standard-basic"
                           fullWidth
                           label="Title"
                           variant="outlined" />
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
                <Button variant="contained" onClick={handleSearch}>Search</Button>
                <Button variant="contained" onClick={handleSearchArtist}>Search (Artist Only)</Button>
            </Container>
            <TextField sx={{color: 'black'}} value={lyrics}></TextField>
        </Box>
)
}

export default Search