import LyricsResponse from "../types/responses/LyricsResponse.ts";
import processedLyrics from "../types/ProcessedLyrics.ts";

const HEADERS = {
    'Lrclib-Client': 'LalalaEnjoyer v0.0.1 (local only)'
}

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
        throw error;
    }
}

function calculateNonsenseCount(lyrics: string) {
    const laRegex = ["la\\s", "la-", "oh\\s", "oh-", "lala", "la\\)", "oh\\)"];
    const multipliers = [1, 1, 1, 1, 2, 1, 1];
    let count = 0;
    for (const index in laRegex) {
        const la = laRegex[index];
        const regex = new RegExp(la, 'gi');
        const matches = lyrics.toLowerCase().match(regex);
        console.log(matches);
        const multiplier = multipliers[index];
        count += matches ? matches.length * multiplier : 0;
    }
    return count;
}

async function processLyrics (trackName: string, trackArtist: string) {
    const lyrics = await fetchLyrics(trackName, trackArtist);
    const nonsenseCount = calculateNonsenseCount(lyrics.plainLyrics);
    const lyricWords = lyrics.plainLyrics.split(/[\s-]+/);
    const lyricsWordCount = lyricWords.filter(word => word.length > 0).length;
    const processedLyrics : processedLyrics = {
        lyrics: lyrics,
        nonsenseWordCount: nonsenseCount,
        totalWordCount: lyricsWordCount
    }
    return processedLyrics;
}

export default processLyrics;