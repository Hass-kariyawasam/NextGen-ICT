import { useState } from "react";
import { MenuIcon, XIcon, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const colorMode = useColorMode();
    const theme = useTheme();
    
    return (
        <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
            style={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 3, 66, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
        >
            <Link to="/"><img className="h-9 w-auto" src="/agentix-react/assets/logo.svg" alt="logo" /></Link>
            
            <div className="hidden lg:flex items-center space-x-6">
                <button onClick={colorMode.toggleColorMode} className="p-2 rounded-full hover:bg-gray-200/20">
                    {theme.palette.mode === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
                </button>
                {user ? (
                    <Link to="/dashboard-lms"><button className="px-6 py-2 bg-green-600 text-white rounded-md">Go to Nextgen-LMS</button></Link>
                ) : (
                    <Link to="/login"><button className="px-6 py-2 border border-slate-400 rounded-md">Login</button></Link>
                )}
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden"><MenuIcon /></button>
        </motion.nav>
    );
}