import {Box, Container} from "@mui/material";
import {useEffect, useState} from "react";
import {fetchReleaseGroups} from "../services/get-artists.ts";
import AlbumTile from "./AlbumTile.tsx";
import {IReleaseGroup} from "musicbrainz-api";
import {animate, motion, useMotionValue} from "framer-motion";
import {useLocation} from "react-router-dom";


function Albums () {
    const [releases, setReleases] = useState<IReleaseGroup[]>([]);
    const [albumIndex, setAlbumIndex] = useState(0);
    const [albumIds, setAlbumIds] = useState<string[]>([]);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q");
    const [query, setQuery] = useState<string>(searchQuery ? searchQuery : "");

    const xTranslation = useMotionValue(0);

    useEffect(() => {
        async function handleSearchArtist () {
            const releaseGroups = await fetchReleaseGroups(query);
            if (releaseGroups) {
                //Sort the releases by their first release date
                releaseGroups.sort((a, b) => {
                    const dateA = new Date(a['first-release-date']);
                    const dateB = new Date(b['first-release-date']);
                    return dateA.getTime() - dateB.getTime();
                });
                setAlbumIndex(0);
                setReleases(releaseGroups.reverse());
                setAlbumIds(releaseGroups.map(release => release.id));
            } else {
                setReleases([]);
            }
        }

        handleSearchArtist();
    }, [query])

    useEffect(() => {
        // Help from: https://www.youtube.com/watch?v=Ot4nZ6UjJLE

        const updatePosition = () => {
            const target = document.getElementById(albumIds[albumIndex]);
            const scroller = document.getElementById("scrolling");
            let finalPosition = 0;
            const startingPosition = xTranslation.get();
            if (target && scroller) {
                const xPos = target.getBoundingClientRect().x
                const targetWidth = target.getBoundingClientRect().width
                const scrollerWidth = scroller.getBoundingClientRect().width
                finalPosition = (xTranslation.get() - (xPos - (scrollerWidth / 2) + targetWidth / 2));
            }

            const controls = animate(xTranslation, [startingPosition, finalPosition], {
                ease: 'easeOut',
                duration: 0.5,
            })
            return controls.stop;
        }

        updatePosition();
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        }
    }, [xTranslation, albumIds, albumIndex]);

    const album_rows = () =>
        releases.map((release : IReleaseGroup) => <AlbumTile release={release} key={release.id} />);


    return (
        <Box sx={{bgcolor: 'black', height: '100vh', width: '100vw'}}>
            <Container id="scrolling" sx={{overflowX: 'none', marginTop: '25vh', minWidth: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }}}>
                <motion.div id="scroller" style={{x: xTranslation, height: '50vh', display: 'flex'}}>
                    {album_rows()}
                </motion.div>
            </Container>
            <div style={{display: (albumIndex < albumIds.length - 1) && (albumIds.length > 0) ? "flex" : "none"}}>
                <button onClick={() => setAlbumIndex(Math.min( albumIndex + 1, albumIds.length - 1))} style={{background: "none", border: "none"}}>
                    <div className="arrow-right" style={{position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="white" fill="white" style={{width: '50%', height: '50%'}}>
                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                        </svg>
                    </div>
                </button>
            </div>
            <div style={{display: (albumIndex > 0) && (albumIds.length > 0)? "flex" : "none"}}>
                <button onClick={() => setAlbumIndex(Math.max(albumIndex - 1, 0))} style={{background: "none", border: "none"}}>
                    <div className="arrow-left" style={{position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%) scaleX(-1)', display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="white" fill="white" style={{width: '50%', height: '50%'}}>
                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                        </svg>
                    </div>
                </button>
            </div>
        </Box>
)
}

export default Albums