"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FolderOpen, Loader2, CheckCircle2, FileText } from "lucide-react";
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
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-violet-400 bg-violet-50"
            : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40",
          isLoading && "opacity-60 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-violet-600 animate-spin" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-700">Analysing your sales data…</p>
                <p className="text-sm text-slate-400 mt-1">This usually takes 2–5 seconds</p>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                <FolderOpen className="w-7 h-7 text-violet-600" />
              </div>
              <p className="text-base font-semibold text-violet-700">Drop it here</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-amber-100 flex items-center justify-center">
                <CloudUpload className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-700">
                  Drag & drop your sales file here
                </p>
                <p className="text-sm text-slate-400 mt-1">or click to browse</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge bg-slate-100 text-slate-600">CSV</span>
                <span className="badge bg-slate-100 text-slate-600">Excel (.xlsx)</span>
                <span className="badge bg-slate-100 text-slate-600">Max 10 MB</span>
              </div>
              {selectedFile && !isLoading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedFile.name} ({formatSize(selectedFile.size)})</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
        <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800 font-medium mb-0.5">Expected columns in your file</p>
          <p className="text-xs text-amber-700">
            <strong>Required:</strong> Date, Product Name, Quantity Sold &nbsp;·&nbsp;
            <strong>Optional:</strong> Category, Price, Color, Fabric
          </p>
          <p className="text-xs text-amber-600 mt-1">The tool works even if some columns are missing.</p>
        </div>
      </div>
    </div>
  );
}
