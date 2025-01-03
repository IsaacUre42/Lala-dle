import {Box, Button, Card, Container, Stack, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {fetchReleaseGroups} from "../services/artists.ts";
import AlbumTile from "./AlbumTile.tsx";
import {IReleaseGroup} from "musicbrainz-api";


function Search () {
    const [searchArtist, setSearchArtist] = useState("");
    const [releases, setReleases] = useState<IReleaseGroup[]>([]);
    const albumsContainerRef = useRef<HTMLDivElement>(null);
    const [albumIndex, setAlbumIndex] = useState(0);
    const [albumIds, setAlbumIds] = useState<string[]>([]);

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
        if (albumsContainerRef.current) {
            const selected = document.getElementById(albumIds[albumIndex]);
            if (selected) {
                selected.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    }, [releases, albumIndex, albumIds]);

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
            <Container sx={{overflowX: 'scroll', marginTop: 10, minWidth: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }}}>
                <Stack direction={"row"} sx={{paddingLeft: '40%'}} ref={albumsContainerRef}>
                    {album_rows()}
                </Stack>
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