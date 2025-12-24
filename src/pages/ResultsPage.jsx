import React, { useState, useMemo } from 'react';
import { ArrowLeft, Database, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DUMMY_DATA = [
    { id: 1, name: "Midnight Echoes", albumNumber: 42 },
    { id: 2, name: "Neon Horizon", albumNumber: 15 },
    { id: 3, name: "Velvet Shadows", albumNumber: 8 },
    { id: 4, name: "Crystal Rain", albumNumber: 23 },
    { id: 5, name: "Solar Flare", albumNumber: 56 },
];

const ResultsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return DUMMY_DATA.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.albumNumber.toString().includes(query)
        );
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            <Database className="text-indigo-400" />
                            Import Results
                        </h2>
                        <p className="text-slate-400">
                            Previewing imported data from <span className="text-emerald-400 font-mono">upload.csv</span>
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Upload
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or album number..."
                        className="block w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Table Container */}
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">ID</th>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium text-right">Album Number</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredData.length > 0 ? (
                                    filteredData.map((row) => (
                                        <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-slate-400 font-mono text-sm">{row.id}</td>
                                            <td className="p-4 text-slate-200 font-medium group-hover:text-white">{row.name}</td>
                                            <td className="p-4 text-slate-400 text-right font-mono">{row.albumNumber}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-500">
                                            No results found for "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-center md:text-right">
                        <p className="text-xs text-slate-500">
                            Showing {filteredData.length} records • Generated {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResultsPage;
