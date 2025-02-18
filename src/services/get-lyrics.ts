import LyricsResponse from "../types/responses/LyricsResponse.ts";
import processedLyrics from "../types/Lyrics.ts";
import Lyrics from "../types/Lyrics.ts";

const HEADERS = {
    'Lrclib-Client': 'Lala-dle v0.1.0 (https://github.com/IsaacUre42/Lala-dle)'
}


/**
 * Albums and fetch song lyrics information by song name and artist
 * Kudos to lrclib.net
 *
 * @param trackName Song Name
 * @param trackArtist Artist Name
 */
async function fetchLyrics (trackName: string, trackArtist: string) {
    try {
        const encodedTrackName = encodeURIComponent(trackName);
        const encodedTrackArtist = encodeURIComponent(trackArtist)
        const response = await fetch(`https://lrclib.net/api/get?track_name=${encodedTrackName}&artist_name=${encodedTrackArtist}`, {
            method: 'GET',
            headers: HEADERS
        });
        if (!response.ok) {
            throw new Error(`Lrclib request failed: ${response.status}`);
        }
        const data : LyricsResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return null;
    }
}

/**
 * Use Regex to count the occurrences of nonsense lyrics in a song.
 * @param lyrics Song Lyrics
 */
function calculateNonsenseCount(lyrics: string) {
    const laRegex = ["la\\s", "la-", "oh\\s", "oh-", "lala", "la\\)", "oh\\)", "na\\s", "na-", "na\\)"];
    let count = 0;
    for (const index in laRegex) {
        const regex = new RegExp(laRegex[index], 'gi');
        const matches = lyrics.toLowerCase().match(regex);
        console.log(matches);
        let multiplier = 1;
        if (matches != null) {
            multiplier = Math.floor(matches[0].trim().length / 2) // Count 4 letter nonsense more than once.
        }
        count += matches ? matches.length * multiplier : 0;
    }
    return count;
}

/**
 * The public function that calls for a song lookup and processes the result.
 *
 * @param trackName Song Name
 * @param trackArtist Song Artist
 *
 * @returns Lyrics Type
 */
async function processLyrics (trackName: string, trackArtist: string) {
    const lyrics = await fetchLyrics(trackName, trackArtist);
    if (lyrics !== null && lyrics.plainLyrics !== null) {
        const nonsenseCount = calculateNonsenseCount(lyrics.plainLyrics);
        const lyricWords = lyrics.plainLyrics.split(/[\s-]+/);
        const lyricsWordCount = lyricWords.filter(word => word.length > 0).length;
        const processedLyrics : processedLyrics = {
            text: lyrics,
            nonsenseWordCount: nonsenseCount,
            totalWordCount: lyricsWordCount,
            found: true
        }
        return processedLyrics;
    }
    const processedLyrics : Lyrics = {
        text: {albumName: "", plainLyrics: "", artistName: "", syncedLyrics: "", trackName: "", id: 0, duration: 0, instrumental: false},
        nonsenseWordCount: 0,
        totalWordCount: 0,
        found: false
    }
    return processedLyrics;
}

export default processLyrics;