import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';
import { parseResume } from '../../services/api';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';

interface Props {
  onFileUploaded: (bullets: BulletPoint[], file: File) => void;
  onBack: () => void;
}

const TITLE = "Upload Resume";
const SUBTITLE =
  "Upload your resume to begin exploring your professional identity. We'll extract your experiences and help you categorize them.";

export default function FileUpload({ onFileUploaded, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    visibleTitle,
    visibleSubtitle,
    showTitleCursor,
    showSubtitleCursor,
    contentVisible,
  } = useTypingAnimation(TITLE, SUBTITLE);

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
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">05</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="sr-only">{TITLE}</h2>
        <p
          aria-hidden="true"
          className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 text-center uppercase"
        >
          {visibleTitle}
          {showTitleCursor && <span className="typing-cursor-light" />}
        </p>

        <div className="relative mb-6 text-center w-full">
          <p className="text-white text-sm md:text-base invisible">
            {SUBTITLE}
          </p>
          <p className="sr-only">{SUBTITLE}</p>
          <p
            aria-hidden="true"
            className="absolute inset-0 text-white text-sm md:text-base text-center"
          >
            {visibleSubtitle}
            {showSubtitleCursor && <span className="typing-cursor-light" />}
          </p>
        </div>

        <div
          className={`transition-opacity duration-500 w-full flex flex-col items-center ${contentVisible ? "opacity-100" : "opacity-0"}`}
          {...(!contentVisible && { inert: "" as unknown as string })}
        >
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`
              w-full rounded-xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${
                isDragActive
                  ? 'bg-white/90 ring-2 ring-[#469B57]/30'
                  : 'bg-white/80 hover:bg-white/90'
              }
            `}
          >
            <input {...getInputProps()} />

            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-3 border-[#366946] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-lg text-[#262626] font-sans">
                  Processing your resume...
                </p>
                <p className="text-sm text-[#525252] mt-2">
                  Extracting bullet points and formatting
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#469B57]/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[#262626]" />
                </div>
                {isDragActive ? (
                  <p className="text-lg text-[#262626] font-medium">
                    Drop your resume here
                  </p>
                ) : (
                  <>
                    <p className="text-lg text-[#262626] mb-2">
                      Drag and drop your resume here
                    </p>
                    <p className="text-sm text-[#525252]">
                      or click to browse your files
                    </p>
                    <p className="text-xs text-[#525252]/60 mt-4">
                      Accepts PDF or DOCX files up to 10MB
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 w-full bg-white/80 rounded-xl p-4">
              <p className="text-[#9D162E] text-sm">
                <span className="font-medium">Error:</span> {error}
              </p>
              <p className="text-[#9D162E] text-sm mt-1">
                Please check the file type and try again.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onBack}
          className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
