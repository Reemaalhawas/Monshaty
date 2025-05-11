import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import { useData } from '../contexts/DataContext';

const UploadPage = () => {
  const router = useRouter();
  const { setData, setHeaders, setTypes } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFile(droppedFile);
    } else {
      setError('يرجى تحميل ملف CSV فقط | Please upload a CSV file only');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        setError('يرجى تحميل ملف CSV فقط | Please upload a CSV file only');
        setFile(null);
        return;
      }
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the file format.');
          return;
        }

        const headers = results.meta.fields || [];
        const types = headers.reduce((acc: Record<string, string>, header) => {
          const values = results.data.map((row: any) => row[header]);
          const isNumeric = values.every((value: any) => !isNaN(parseFloat(value)));
          acc[header] = isNumeric ? 'numeric' : 'categorical';
          return acc;
        }, {});

        setData(results.data);
        setHeaders(headers);
        setTypes(types);
        setSuccess('تم تحميل الملف بنجاح! جاري التوجيه إلى التحليل... | File uploaded successfully! Redirecting to analysis...');
        
        // Redirect to descriptive analysis page after 2 seconds
        setTimeout(() => {
          router.push('/descriptive-analysis');
        }, 2000);
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-6">تحميل البيانات | Upload Data</h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto">قم بتحميل ملف CSV لبدء التحليل | Upload a CSV file to start analysis</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">اختر الملف | Choose File</h2>
                <p className="text-lg text-gray-600">CSV files only</p>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div className="space-y-2">
                  <div className="text-xl text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-lg text-gray-500">CSV files only</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-lg text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-lg text-green-600">{success}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;