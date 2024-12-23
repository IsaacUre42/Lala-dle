import React from 'react';
import Album from '../types/Album.ts';
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";

type AlbumTileProps = {
    album: Album;
};

const AlbumTile: React.FC<AlbumTileProps> = ( {album}) => {
    const [albumTitle, setAlbumTitle] = React.useState(album.title);
    const [albumCoverUrl, setAlbumCoverUrl] = React.useState(album.coverArtUrl);
    const [albumArtist, setAlbumArtist] = React.useState(album.artist);


    return (
        <Card sx={{ maxWidth: 350 }}>
            <CardMedia
                sx={{ height: 300, width: 300 }}
                image={albumCoverUrl}
                title={albumTitle}
                />
            <CardContent>
                <Typography gutterBottom variant={"h3"} component={"div"}>
                    {albumTitle}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AlbumTile;