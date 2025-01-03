import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {fetchCoverArt, fetchFirstValidRelease} from "../services/artists.ts";
import {IReleaseGroup} from "musicbrainz-api";
// import Lyrics from "../types/Lyrics.ts";

type AlbumTileProps = {
    release: IReleaseGroup;
};

const AlbumTile: React.FC<AlbumTileProps> = ( {release}) => {
    const [coverArt, setCoverArt] = useState("");
    const [title, setTitle] = useState(release.title);
    const [albumMbid, setAlbumMbid] = useState("");
    // const [tracks, setTracks] = useState<Lyrics[]>([]);

    useEffect(() => {
        const lazyLoadArt = async () => {
            if (albumMbid !== "") {
                const artworkUrl = await fetchCoverArt(albumMbid);
                setCoverArt(artworkUrl ? artworkUrl : "");
            }
        }
        lazyLoadArt()
    }, [albumMbid]);

    useEffect(() => {
        const loadAlbum = async () => {
            const result = await fetchFirstValidRelease(release.id);
            setAlbumMbid(result.id);
            setTitle(result.title);
        }
        loadAlbum();
    }, [release]);

    return (
        <Box id={release.id} sx={{ margin: '10%', minHeight: '30vh'}}>
            <img src={coverArt} style={{width: '40vh', aspectRatio: '1/1'}} alt={title}>
            </img>
        </Box>
    );
};

export default AlbumTile;