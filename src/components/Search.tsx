import {TextField} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Search () {
    const [artist, setArtist] = useState("");
    const navigate = useNavigate();

    const searchArtist = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.code === "Enter"){
            navigate(`/search?q=${artist}`);
        }
    }

    return (
        <TextField id="outlined-basic" label="Artist" variant="outlined" fullWidth
                   onChange={(event) => setArtist(event.target.value)}
                   value={artist}
                   onKeyDown={(event) => searchArtist(event)}
        />
    );
}

export default Search;