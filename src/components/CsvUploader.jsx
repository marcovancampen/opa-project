import React, { useState, useRef } from 'react';
import { Upload, FileType, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CsvUploader = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileInput = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        if (file && file.type === 'text/csv' || file?.name.endsWith('.csv')) {
            setFile(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6">
            <div
                className={`relative group cursor-pointer transition-all duration-300 ease-in-out border-2 border-dashed rounded-3xl p-12 text-center
        ${isDragging
                        ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                        : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-900/50 bg-slate-900/30'
                    }
        ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInput}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`p-4 rounded-full transition-all duration-300 ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/30'}`}>
                        {file ? <CheckCircle size={40} /> : <Upload size={40} />}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-100">
                            {file ? 'File Selected' : 'Upload your CSV'}
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            {file
                                ? <span className="font-mono text-emerald-400">{file.name}</span>
                                : 'Drag and drop your file here, or click to browse'
                            }
                        </p>
                    </div>
                </div>

                {file && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            clearFile();
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {file && (
                <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => navigate('/results')}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Process CSV
                    </button>
                </div>
            )}
        </div>
    );
};

export default CsvUploader;
