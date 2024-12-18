import LyricsResponse from "./responses/LyricsResponse.ts";

type ProcessedLyrics = {
    lyrics: LyricsResponse;
    totalWordCount: number;
    nonsenseWordCount: number;
}

export default ProcessedLyrics;