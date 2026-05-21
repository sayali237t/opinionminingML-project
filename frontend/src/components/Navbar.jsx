import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-black p-8 flex items-center justify-between">
            <div className="text-2xl bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text font-bold ">
                Marathi Sentiment Analysis
            </div>
            <div className="flex space-x-6 text-white">
                <Link to="/" className="font-bold text-white hover:text-purple-500">Home</Link>
                <Link to="/how" className="font-bold text-white hover:text-purple-500">How</Link>
                <Link to="/what" className="font-bold text-white hover:text-purple-500">What</Link>
                <Link to="/who" className="font-bold text-white hover:text-purple-500">Who</Link>
            </div>
        </nav>
    );
}
