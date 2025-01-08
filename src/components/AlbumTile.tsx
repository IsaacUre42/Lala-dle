import React, {useEffect, useState} from 'react';
import {fetchCoverArt, fetchFirstValidRelease} from "../services/artists.ts";
import {IReleaseGroup} from "musicbrainz-api";

type AlbumTileProps = {
    release: IReleaseGroup;
};

const AlbumTile: React.FC<AlbumTileProps> = ({release}) => {
    const [coverArt, setCoverArt] = useState("");
    const [title, setTitle] = useState(release.title);
    const [albumMbid, setAlbumMbid] = useState("");

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
        <div id={release.id} style={{marginLeft: '5vw', height: '30vh', position: 'relative'}}>
            <div className="album" style={{height: '90%',
                backgroundColor: 'gray', aspectRatio: '1/1',
                display: coverArt ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'}}>
                {title}
            </div>
            <img src={coverArt} style={{aspectRatio: '1/1', display: coverArt ? 'block' : 'none'}} alt={title} className="album">
            </img>
        </div>
    );
};

export default AlbumTile;