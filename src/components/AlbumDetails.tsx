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
    const [selected,  setSelected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const setLyrics = async (track: string) => {
        setNotFound(false);
        setLoading(true);
        const processedLyrics = await processLyrics(track, artist);
        if (processedLyrics.found) {
            const words = processedLyrics.text.plainLyrics;
            setLoading(false);
            setDisplayedLyrics(words);
        } else {
            setNotFound(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        setLyrics(tracks[0]);
    }, [tracks]);

    useEffect(() => {
        async function loadTracks() {
            const tracks = await fetchTracks(mbid);
            if (tracks) {
                setTracks(tracks);
            }
        }
        loadTracks();
    }, [mbid]);

    return (
        <div style={{height: '100%', width: '100%', background: 'rgba(0,0,0,0.8)', position: 'absolute', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Container sx={{background: "white", height: '75vh', width: '50vw', overflowY: 'scroll'}}>
                <Grid2 container>
                    <Grid2 size={12} container style={{marginTop: '10px'}}>
                        <Grid2 size={6} style={{paddingLeft: '2em'}}>
                            <strong>Track</strong>
                        </Grid2>
                        <Grid2 size={5} style={{paddingLeft: '1.5em'}}>
                            <strong>Lyrics</strong>
                        </Grid2>
                        <Grid2 size={1}>
                            <Button onClick={handleClose} size={"small"}>
                                <strong>Close</strong>
                            </Button>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={6}>
                        <Container sx={{maxHeight: '65vh', overflowY: 'scroll'}}>
                            <MenuList>
                                {tracks.map((track, index) => (
                                    <MenuItem onClick={() => {setLyrics(track); setSelected(index)}}
                                              style={{background: (index === selected) ? 'lightgray' : ''}}>
                                        <Typography variant="inherit" noWrap>
                                            {track}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Container>
                    </Grid2>
                    <Grid2 size={6}>
                        {loading ?
                        <Container>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                                <img src="/loading.gif" alt="Loading..." />
                            </div>
                        </Container> :
                        <Container sx={{maxHeight: '65vh', overflowY: 'scroll'}}>
                            <Typography sx={{ whiteSpace: 'pre-line'}}>
                                {notFound ? "Lyrics not available for this track :(" : displayLyrics}
                            </Typography>
                        </Container>
                        }
                    </Grid2>
                </Grid2>
            </Container>
        </div>
    );
}

export default AlbumDetails;