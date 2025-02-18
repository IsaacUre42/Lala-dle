import {Container} from "@mui/material";
import Search from "./Search.tsx";

function Home  ()  {
    return (
        <Container sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh'}}>
            <Container sx={{
                width: '50vw',
                backgroundColor: 'white',
                padding: 5,
                display: 'flex',
                margin: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1em'
            }}>
                <Search />
            </Container>
        </Container>
    )
}

export default Home;