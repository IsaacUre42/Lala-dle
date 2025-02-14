import React, { useEffect, useState } from 'react';
import { fetchCoverArt, queueFetchFirstValidRelease } from "../services/get-artists.ts";
import { IReleaseGroup } from "musicbrainz-api";

type AlbumTileProps = {
    release: IReleaseGroup;
    handleClick: (mbid: string) => void;
    artist: string; //TODO: Pass through the artist so it can be used to fetch lyrics?
};

const AlbumTile: React.FC<AlbumTileProps> = ({ release, handleClick }) => {
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
            const result = await queueFetchFirstValidRelease(release.id);
            setAlbumMbid(result.id);
            setTitle(result.title);
        }
        loadAlbum();
    }, [release]);

    return (
        <div id={release.id}
             style={{ marginLeft: '5vw', height: '50vh', position: 'relative' }}
             onClick={() => handleClick(albumMbid)}
        >
            <div className="album" style={{
                height: '90%',
                backgroundColor: 'gray',
                aspectRatio: '1/1',
                display: coverArt ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
            }}>
                {title}
            </div>
            <img draggable='false' src={coverArt} style={{
                userSelect: 'none',
                aspectRatio: '1/1',
                display: coverArt ? 'block' : 'none',
                height: '100%'}}
                 alt={title}
                 className="album">
            </img>
        </div>
    );
};

export default AlbumTile;