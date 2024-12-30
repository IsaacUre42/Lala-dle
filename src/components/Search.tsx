import {Box, Button, Container, Grid2, TextField} from "@mui/material";
import {useState} from "react";
import {fetchReleaseGroups} from "../services/artists.ts";
import AlbumTile from "./AlbumTile.tsx";
import {IReleaseGroup} from "musicbrainz-api";


function Search () {
    const [searchArtist, setSearchArtist] = useState("");
    const [releases, setReleases] = useState<IReleaseGroup[]>([]);

    const handleSearchArtist = async () => {
        const releaseGroups = await fetchReleaseGroups(searchArtist);
        setReleases(releaseGroups ? releaseGroups : []);
    }

    const album_rows = () =>
        releases.map((release : IReleaseGroup) => <AlbumTile release={release} key={release.id} />);

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
            <Grid2>
                {album_rows()}
            </Grid2>
        </Box>
)
}

export default Search