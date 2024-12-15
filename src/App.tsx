import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Search from "./components/Search.tsx";

function App() {
  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route path="/" element={<Search/>}></Route>
              </Routes>
          </Router>
      </div>
  )
}

export default App
