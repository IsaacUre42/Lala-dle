type LyricsResponse = {
    id: number;
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    instrumental: boolean;
    plainLyrics: string;
    syncedLyrics: string;
}

export default LyricsResponse