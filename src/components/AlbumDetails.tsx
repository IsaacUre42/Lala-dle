import {
    Button,
    Container,
    Grid2,
    MenuItem,
    MenuList,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {fetchTracks} from "../services/get-artists.ts";
import processLyrics from "../services/get-lyrics.ts";

type AlbumDetailsProps = {
    mbid: string;
    artist: string;
    handleClose: () => void;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({mbid, artist, handleClose}) => {
    const [tracks, setTracks] = useState<string[]>([]);
    const [displayLyrics,  setDisplayedLyrics] = useState("");

    useEffect(() => {
        async function loadTracks() {
            const tracks = await fetchTracks(mbid);
            if (tracks) {
                setTracks(tracks);
            }
        }
        loadTracks();
    }, [mbid]);

    const setLyrics = async (track: string) => {
        const processedLyrics = await processLyrics(track, artist);
        const words = processedLyrics.text.plainLyrics;
        setDisplayedLyrics(words);

    }

    return (
        <div style={{height: '100%', width: '100%', background: 'rgba(0,0,0,0.8)', position: 'absolute', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Container sx={{background: "white", height: '75vh', width: '50vw', overflowY: 'scroll'}}>
                <Grid2 container>
                    <Grid2 size={12}>
                        <Container sx={{display: 'flex', justifyContent: 'flex-end', marginBottom: '5px', marginTop: '5px'}}>
                            <Button variant={"contained"} onClick={handleClose}>
                                {artist}
                            </Button>
                        </Container>
                    </Grid2>
                    <Grid2 size={6}>
                        <Container sx={{maxHeight: '65vh', overflowY: 'scroll'}}>
                            <MenuList>
                                {tracks.map((track) => (
                                    <MenuItem onClick={() => {setLyrics(track)}}>
                                        <Typography variant="inherit" noWrap>
                                            {track}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Container>
                    </Grid2>
                    <Grid2 size={6}>
                        <Container sx={{maxHeight: '65vh', overflowY: 'scroll'}}>
                            <Typography sx={{ whiteSpace: 'pre-line'}}>
                                {displayLyrics}
                            </Typography>
                        </Container>
                    </Grid2>
                </Grid2>
            </Container>
        </div>
    );
}

export default AlbumDetails;