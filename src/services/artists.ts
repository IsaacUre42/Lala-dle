import {IRelease, MusicBrainzApi} from 'musicbrainz-api';
import Album from "../types/Album.ts";

const mbApi = new MusicBrainzApi({
    appName: 'laladle',
    appVersion: '0.1.0',
    appContactInfo: 'zeek28@outlook.com',
});

/**
 * Fetch a list of music-brainz releases for all the albums by a given artist.
 * @param artist Artist Name
 */
async function fetchAlbums (artist: string) {
    try {
        const result = await mbApi.search('artist', {query: {artist}});
        const releaseGroups = await mbApi.browse('release-group',{'artist': result.artists[0].id});

        const albums: IRelease[] = [];
        for (const releaseGroup of releaseGroups["release-groups"]) {
            if (releaseGroup["primary-type"] === "Album" && releaseGroup["secondary-types"].length === 0) {
                const bestRelease = await fetchFirstValidRelease(releaseGroup.id);
                albums.push(bestRelease);
            }
        }
        return [albums, result.artists[0].name];

    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

/**
 * Fetch the list of tracks contained within a given album by music-brainz release id
 * @param albumId Music-Brainz release id
 */
export async function fetchTracks (albumId : string) {
    try {
        const tracks : string[] = []
        const single = await mbApi.lookup('release', albumId, ["recordings"]);
        for (const medium of single.media) {
            for (const track of medium.tracks) {
                tracks.push(track.title)
            }
        }
        return tracks;
    } catch(error) {
        console.error('Error fetching tracks:', error);
    }
}

/**
 * Fetch the url for cover art for a given music-brainz release id.
 * @param albumId Music-Brainz Release Id.
 */
async function fetchCoverArt(albumId: string) {
    try {
        const response = await fetch(`https://coverartarchive.org/release/${albumId}/front`);
        return response.url;

    } catch (error) {
        console.info('Error fetching cover art:', error);
        return null;
    }
}

/**
 * Fetch the first release of a release group that is official and contains cover art.
 * @param releaseGroupId Music-Brainz Release Group Id
 */
async function fetchFirstValidRelease(releaseGroupId: string) {
    try {
        const releases = await mbApi.browse('release', { 'release-group': releaseGroupId });
        for (const release of releases.releases) {
            if (release.status === 'Official' && release['cover-art-archive'].artwork) {
                return release;
            }
        }
        //If no cover art, just return the first release.
        return releases.releases[0];
    } catch (error) {
        console.error('Error fetching releases:', error);
        throw error;
    }
}

/**
 * Return a list of processed album types without the track list to reduce API calls.
 * @param artist Artist Name
 */
async function processArtist(artist: string) {
    try {
        const processedAlbums: Album[] = []
        const releases = await fetchAlbums(artist);
        for (const release of releases) {
            const albumArtist =
            const artworkUrl = await fetchCoverArt(release.id);
            const album : Album = {mbid=release.id, artist=artist, title=release, coverArtUrl=artworkUrl, tracks=[]}
            processedAlbums.push(album);
        }
        return processedAlbums;
    } catch(error) {
        console.error('Failed to process artist:', error);
        throw error;
    }
}

export default processArtist;