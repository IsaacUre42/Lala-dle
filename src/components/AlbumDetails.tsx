import {Button, Container, Table, TableBody, TableCell, TableRow} from "@mui/material";
import React, {useEffect, useState} from "react";
import {fetchTracks} from "../services/get-artists.ts";

type AlbumDetailsProps = {
    mbid: string;
    artist: string;
    handleClose: () => void;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({mbid, artist, handleClose}) => {
    const [tracks, setTracks] = useState<string[]>([]);

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
            <Container sx={{background: "white", height: '50vh', width: '50vw', overflowY: 'scroll'}}>
                <Button variant={"contained"} onClick={handleClose}>
                    {artist}
                </Button>
                <Table>
                    <TableBody>
                        {tracks.map((track, index) => (
                            <TableRow key={index}>
                                <TableCell>{track}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Container>
        </div>
    );
}

export default AlbumDetails;