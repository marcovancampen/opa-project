import { NavLink, Link } from 'react-router-dom';
import { Camera, Users, Sparkles, Upload } from 'lucide-react';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo / Brand */}
                <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold text-lg hover:opacity-80 transition-opacity">
                    <Camera size={24} />
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Foto Archief
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                    <NavLink
                        to="/upload"
                        className={({ isActive }) => `
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }
                        `}
                    >
                        <Upload size={16} />
                        Upload
                    </NavLink>

                    <NavLink
                        to="/search-by-person"
                        className={({ isActive }) => `
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }
                        `}
                    >
                        <Users size={16} />
                        Persoon
                    </NavLink>

                    <NavLink
                        to="/search-by-event"
                        className={({ isActive }) => `
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }
                        `}
                    >
                        <Sparkles size={16} />
                        Event
                    </NavLink>
                </nav>

            </div>
        </header>
    );
};

export default Header;
