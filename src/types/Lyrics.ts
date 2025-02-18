import LyricsResponse from "./responses/LyricsResponse.ts";

type Lyrics = {
    text: LyricsResponse;
    totalWordCount: number;
    nonsenseWordCount: number;
    found: boolean;
}

export default Lyrics;