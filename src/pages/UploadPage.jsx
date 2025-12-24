import React from 'react';
import CsvUploader from '../components/CsvUploader';

const UploadPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-8 text-center">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent pb-1">
                        CSV Importer
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Upload your data effortlessly.
                    </p>
                </div>

                <CsvUploader />
            </div>
        </div>
    );
};

export default UploadPage;
