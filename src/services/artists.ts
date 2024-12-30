import {IReleaseGroup, MusicBrainzApi} from 'musicbrainz-api';

const mbApi = new MusicBrainzApi({
    appName: 'laladle',
    appVersion: '0.1.0',
    appContactInfo: 'zeek28@outlook.com',
});

/**
 * Fetch a list of music-brainz releases for all the albums by a given artist.
 * @param artist Artist Name
 */
export async function fetchReleaseGroups (artist: string) {
    try {
        const result = await mbApi.search('artist', {query: {artist}});
        const releaseGroups = await mbApi.browse('release-group',{'artist': result.artists[0].id});

        const validReleaseGroups: IReleaseGroup[] = [];
        for (const releaseGroup of releaseGroups["release-groups"]) {
            if (releaseGroup["primary-type"] === "Album" && releaseGroup["secondary-types"].length === 0) {
                validReleaseGroups.push(releaseGroup);
            }
        }
        return validReleaseGroups;

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
export async function fetchCoverArt(albumId: string) {
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
export async function fetchFirstValidRelease(releaseGroupId: string) {
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