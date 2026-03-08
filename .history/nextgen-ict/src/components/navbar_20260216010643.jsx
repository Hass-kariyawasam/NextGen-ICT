import { useState } from "react";
import { MenuIcon, XIcon, Sun, Moon } from "lucide-react"; // Icons import kala
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Auth context gaththa
import { useColorMode } from "../context/ThemeContext"; // Theme context gaththa
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth(); // User innawada balanna
    const colorMode = useColorMode(); // Theme maru karanna
    const theme = useTheme(); // Current theme eka ganna
    
    const navlinks = [
        { href: "#creations", text: "Creations" },
        { href: "#about", text: "About" },
        { href: "#testimonials", text: "Testimonials" },
        { href: "#contact", text: "Contact" },
    ];

    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-opacity-80"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                style={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 3, 66, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
            >
                <Link to="/">
                    <img className="h-9 w-auto" src="/public/logo.png" width={138} height={36} alt="logo" />
                </Link>

                <div className="hidden lg:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        <a key={link.href} href={link.href} className={`transition ${theme.palette.mode === 'dark' ? 'text-white hover:text-slate-300' : 'text-black hover:text-slate-600'}`}>
                            {link.text}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex items-center space-x-3">
                    {/* Theme Toggle Button */}
                    <button onClick={colorMode.toggleColorMode} className="p-2 rounded-full hover:bg-gray-200/20 transition text-inherit">
                        {theme.palette.mode === 'dark' ? <Sun className="text-yellow-400 size-6" /> : <Moon className="text-gray-700 size-6" />}
                    </button>

                    {/* Conditional Button Logic */}
                    {user ? (
                        <Link to="/dashboard-lms">
                            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-md active:scale-95 shadow-md">
                                Go to Nextgen-LMS
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95">
                                Login
                            </button>
                        </Link>
                    )}
                </div>

                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-white">
                        {link.text}
                    </a>
                ))}
                
                {user ? (
                    <Link to="/dashboard-lms" onClick={() => setIsMenuOpen(false)}>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-md">
                            Go to Nextgen-LMS
                        </button>
                    </Link>
                ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="px-6 py-2 border border-slate-400 text-white rounded-md">
                            Login
                        </button>
                    </Link>
                )}

                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}