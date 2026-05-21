import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import How from "./pages/How";
import What from "./pages/What";
import Who from "./pages/Who";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how" element={<How />} />
                <Route path="/what" element={<What />} />
                <Route path="/who" element={<Who />} />
            </Routes>
        </Router>
    );
}

export default App;
