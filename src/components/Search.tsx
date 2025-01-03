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
    const xTranslation = useMotionValue(0);

    const handleSearchArtist = async () => {
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
            setAlbumIds(releases.map(release => release.id));
        } else {
            setReleases([]);
        }
    }

    useEffect(() => {
        // Help from: https://www.youtube.com/watch?v=Ot4nZ6UjJLE
        const scroller = document.getElementById("scrolling")
        let finalPosition = 0;
        const startingPosition = xTranslation.get();
        if (scroller) {
            finalPosition = (-(scroller.scrollWidth / albumIds.length) * albumIndex) + scroller.getBoundingClientRect().width / 3;
            console.log(scroller.scrollWidth);
        }

        const controls = animate(xTranslation, [startingPosition, finalPosition], {
            ease: 'easeOut',
            duration: 0.5,
        })
        return controls.stop;
    }, [xTranslation, albumIds, albumIndex]);

    const album_rows = () =>
        releases.map((release : IReleaseGroup) => <AlbumTile release={release} key={release.id} />);

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
                               variant="outlined" />
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
            <Container id="scrolling" sx={{overflowX: 'scroll', marginTop: 10, minWidth: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }}}>
                {/*<Stack direction={"row"} sx={{paddingLeft: '40%'}} ref={albumsContainerRef}>*/}
                {/*    {album_rows()}*/}
                {/*</Stack>*/}

                <motion.div style={{x: xTranslation, height: '50vh', display: 'flex'}}>
                    {album_rows()}
                </motion.div>
            </Container>
            <Button variant="contained" onClick={() => setAlbumIndex(Math.max(albumIndex - 1, 0))}>
                Prev
            </Button>
            <Button variant="contained" onClick={() => setAlbumIndex(Math.min( albumIndex + 1, albumIds.length - 1))}>
                Next
            </Button>
        </Box>
)
}

export default Search