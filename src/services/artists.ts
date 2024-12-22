import {IReleaseGroup, ITrack, MusicBrainzApi} from 'musicbrainz-api';

const mbApi = new MusicBrainzApi({
    appName: 'laladle',
    appVersion: '0.1.0',
    appContactInfo: 'zeek28@outlook.com',
});

async function fetchArtist (artist: string) {
    const result = await mbApi.search('artist', {query: {artist}});
    const releaseGroups = await mbApi.browse('release-group',{'artist': result.artists[0].id});

    const albums: IReleaseGroup[] = [];
    for (const release of releaseGroups["release-groups"]) {
        if (release["primary-type"] === "Album" && release["secondary-types"].length === 0) {
            albums.push(release);
        }
    }
    // const tracks = await fetchTracks(albums);
    // console.log(tracks)

    for (const album of albums) {
        await fetchCoverArt(album.id);
    }
}

async function fetchTracks (albums : IReleaseGroup[]) {
    const tracks : ITrack[] = []
    for (const album of albums) {
        const releaseId = await fetchFirstOfficialReleaseWithCoverArt(album.id);
        const single = await mbApi.lookup('release', releaseId, ["recordings"]);
        for (const medium of single.media) {
            for (const track of medium.tracks) {
                tracks.push(track)
            }
        }
    }
    return tracks;
}

async function fetchCoverArt(albumId: string) {
    try {
        const releaseId = await fetchFirstOfficialReleaseWithCoverArt(albumId);

        const response = await fetch(`https://coverartarchive.org/release/${releaseId}/front`);
        if (!response.ok) {
            throw new Error(`Cover Art Archive request failed: ${response.status}`);
        }
        console.log(response);
        return response.url;

    } catch (error) {
        console.error('Error fetching cover art:', error);
    }
}

async function fetchFirstOfficialReleaseWithCoverArt(releaseGroupId: string) {
    try {
        const releases = await mbApi.browse('release', { 'release-group': releaseGroupId });
        for (const release of releases.releases) {
            if (release.status === 'Official' && release['cover-art-archive'].artwork) {
                return release.id;
            }
        }
        //If no cover art, just return the first release.
        return releases.releases[0].id;
    } catch (error) {
        console.error('Error fetching releases:', error);
        throw error;
    }
}

export default fetchArtist;