"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setSelectedFile(accepted[0]);
        onUpload(accepted[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300",
          isDragActive
            ? "border-purple-400 bg-purple-50 scale-[1.01]"
            : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40",
          isLoading && "opacity-60 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center animate-spin text-3xl">
                ⚙️
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">Analysing your sales data…</p>
                <p className="text-sm text-gray-400 mt-1">This usually takes 2–5 seconds</p>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">📂</div>
              <p className="text-lg font-semibold text-purple-700">Drop it here!</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Drag & drop your sales file here
                </p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="badge bg-gray-100 text-gray-600">CSV</span>
                <span className="badge bg-gray-100 text-gray-600">Excel (.xlsx)</span>
                <span className="badge bg-gray-100 text-gray-600">Max 10 MB</span>
              </div>
              {selectedFile && !isLoading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium">
                  <span>✅</span>
                  <span>{selectedFile.name} ({formatSize(selectedFile.size)})</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800 font-medium mb-1">📋 Expected columns in your file:</p>
        <p className="text-xs text-amber-700">
          <strong>Required:</strong> Date, Product Name, Quantity Sold &nbsp;|&nbsp;
          <strong>Optional:</strong> Category, Price, Color, Fabric
        </p>
        <p className="text-xs text-amber-600 mt-1">Don't worry — the tool works even if some columns are missing.</p>
      </div>
    </div>
  );
}
