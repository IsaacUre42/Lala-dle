import LyricsResponse from "./responses/LyricsResponse.ts";

type Lyrics = {
    text: LyricsResponse;
    totalWordCount: number;
    nonsenseWordCount: number;
}

export default Lyrics;