import {Box, Button, Card, Container, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {fetchReleaseGroups} from "../services/artists.ts";
import AlbumTile from "./AlbumTile.tsx";
import {IReleaseGroup} from "musicbrainz-api";
import {animate, motion, useMotionValue} from "framer-motion";


function Search () {
    const [searchArtist, setSearchArtist] = useState("");
    const [releases, setReleases] = useState<IReleaseGroup[]>([]);
    const [albumIndex, setAlbumIndex] = useState(0);
    const [albumIds, setAlbumIds] = useState<string[]>([]);
    const [tileSelected, setTileSelected] = useState(false);
    const xTranslation = useMotionValue(0);

    async function handleSearchArtist () {
        const releaseGroups = await fetchReleaseGroups(searchArtist);
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

    const handleTileClick = () => {
        setTileSelected(!tileSelected);
    }

    const album_rows = () =>
        releases.map((release : IReleaseGroup) => <AlbumTile release={release} onTileClick={handleTileClick} key={release.id} />);


    return (
        <Box sx={{bgcolor: 'black', height: '100vh', width: '100vw'}}>
            <Card>
                <Container maxWidth={"sm"} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5vh'
                }}>
                    <TextField value={searchArtist}
                               onChange={(event) => setSearchArtist(event.target.value)}
                               id="standard-basic"
                               fullWidth
                               label="Artist"
                               variant="outlined"/>
                </Container>
                <Container maxWidth={"sm"} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2
                }}>
                    <Button variant="contained" onClick={handleSearchArtist}>Search (Artist Only)</Button>
                </Container>
            </Card>
            <Container id="scrolling" sx={{overflowX: 'none', marginTop: 10, minWidth: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }}}>
                <motion.div id="scroller" style={{x: xTranslation, height: '50vh', display: 'flex'}}>
                    {album_rows()}
                </motion.div>
            </Container>
            <Button variant="contained" onClick={() => setAlbumIndex(Math.max(albumIndex - 1, 0))} sx={{position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)'}}>
                &#8592;
            </Button>
            <Button variant="contained" onClick={() => setAlbumIndex(Math.min( albumIndex + 1, albumIds.length - 1))} sx={{position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)'}}>
                &#8594;
            </Button>
        </Box>
)
}

export default Search