import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
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
        <Card sx={{ maxWidth: 350 }}>
            <CardMedia
                sx={{ height: 300, width: 300 }}
                image={coverArt}
                title={title}
                />
            <CardContent>
                <Typography gutterBottom variant={"h3"} component={"div"}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AlbumTile;