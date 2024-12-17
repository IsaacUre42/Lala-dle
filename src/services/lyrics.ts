import LyricsResponse from "../types/responses/LyricsResponse.ts";

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

function calculateLa (lyrics: string) {
    const laRegex = ["la ", "la-", "oh ", "oh-", "lala"]
    let count = 0
    for (const la in laRegex) {
        const matches = lyrics.toLowerCase().match(la);
        count += matches ? matches.length : 0;
    }
    // const lyricWords = lyrics.split(/[\s-]+/);
    // const lyricsWordCount = lyricWords.filter(word => word.length > 0).length;
    return count;
}

export default fetchLyrics;