import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';
import { parseResume } from '../../services/api';

interface Props {
  onFileUploaded: (bullets: BulletPoint[], file: File) => void;
}

export default function FileUpload({ onFileUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      setError(null);

      try {
        const bullets = await parseResume(file);
        onFileUploaded(bullets, file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
    maxFiles: 1,
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro text */}
      <div className="text-center mb-8">
        <p className="text-lg text-[#525252] leading-relaxed max-w-xl mx-auto">
          Upload your resume to begin exploring your professional identity.
          We'll extract your experiences and help you categorize them.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-md p-16 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-[#00693E] bg-[#E8F5E9]'
              : 'border-[#D4D4D4] hover:border-[#00693E] hover:bg-[#F5F5F5]'
          }
        `}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-[#00693E] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-lg text-[#404040] font-sans">
              Processing your resume...
            </p>
            <p className="text-sm text-[#737373] mt-2">
              Extracting bullet points and formatting
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#00693E]" />
            </div>
            {isDragActive ? (
              <p className="text-lg text-[#00693E] font-medium">
                Drop your resume here
              </p>
            ) : (
              <>
                <p className="text-lg text-[#404040] mb-2">
                  Drag and drop your resume here
                </p>
                <p className="text-sm text-[#737373]">
                  or click to browse your files
                </p>
                <p className="text-xs text-[#A3A3A3] mt-4">
                  Accepts PDF or DOCX files up to 10MB
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 bg-[#FFEBEE] border-l-4 border-[#9D162E] rounded">
          <p className="text-[#5F0000] text-sm">
            <span className="font-medium">Error:</span> {error}
          </p>
          <p className="text-[#5F0000] text-sm mt-1">
            Please check the file type and try again.
          </p>
        </div>
      )}
    </div>
  );
}
