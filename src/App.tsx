import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Albums from "./components/Albums.tsx";
import Home from "./components/Home.tsx";
import {createRoot} from "react-dom/client";

function App() {
  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="search" element={<Albums />}/>
              </Routes>
          </Router>
      </div>
  )
}

createRoot(document.getElementById('root')!).render(
    <App />
);

export default App
