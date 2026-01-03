import { useState, useRef } from 'react';
import { Upload, FileType, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const fileInputRef = useRef(null);

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
        if (file && (file.type === 'text/csv' || file?.name.endsWith('.csv'))) {
            setFile(file);
            setUploadResult(null);
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    const clearFile = () => {
        setFile(null);
        setUploadResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/csv/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setUploadResult(data);

            if (data.success) {
                // Clear file after successful upload
                setTimeout(() => {
                    clearFile();
                }, 3000);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadResult({
                success: false,
                message: 'Network error. Make sure the backend is running.'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-100">CSV Upload</h1>
                <p className="text-slate-400">Upload Register17.csv om foto's toe te voegen</p>
            </div>

            {/* Upload Area */}
            <div className="w-full max-w-xl mx-auto">
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
                                {file ? 'Bestand Geselecteerd' : 'Upload CSV'}
                            </h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                {file
                                    ? <span className="font-mono text-emerald-400">{file.name}</span>
                                    : 'Drag and drop je CSV bestand hier, of klik om te bladeren'
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

                {/* Upload Button */}
                {file && !uploadResult && (
                    <div className="mt-6 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    Uploaden...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    CSV Uploaden
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Upload Result */}
                {uploadResult && (
                    <div className={`mt-6 p-6 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${uploadResult.success
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : 'bg-red-500/10 border-red-500/50'
                        }`}>
                        <div className="flex items-start gap-3">
                            {uploadResult.success ? (
                                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h4 className={`font-semibold mb-1 ${uploadResult.success ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                    {uploadResult.success ? 'Upload Succesvol!' : 'Upload Mislukt'}
                                </h4>
                                <p className="text-slate-300 text-sm mb-2">{uploadResult.message}</p>
                                {uploadResult.success && (
                                    <div className="text-sm text-slate-400 space-y-1">
                                        <p>• {uploadResult.photosImported} foto's geïmporteerd</p>
                                        <p>• {uploadResult.peopleImported} personen toegevoegd</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="max-w-xl mx-auto bg-slate-900/30 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">ℹ️ Informatie</h3>
                <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Upload het Register17.csv bestand om foto's toe te voegen</li>
                    <li>• Het systeem haalt automatisch personen en datums eruit</li>
                    <li>• Dubbele entries worden vermeden</li>
                    <li>• Na upload kun je direct zoeken in de foto's</li>
                </ul>
            </div>
        </div>
    );
};

export default UploadPage;
