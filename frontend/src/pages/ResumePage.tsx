import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import FileUpload from "../components/upload/FileUpload";
import BulletPreview from "../components/upload/BulletPreview";

export default function ResumePage() {
  const navigate = useNavigate();
  const {
    bullets,
    uploadedFile,
    resumeStep,
    setResumeStep,
    handleFileUploaded,
    handlePreviewConfirmed,
    markRouteCompleted,
  } = useAppState();

  return (
    <div className="h-[100dvh] overflow-hidden">
      {resumeStep === "upload" && (
        <FileUpload
          onFileUploaded={handleFileUploaded}
          onBack={() => navigate("/intake")}
        />
      )}

      {resumeStep === "preview" && (
        <BulletPreview
          bullets={bullets}
          file={uploadedFile}
          onConfirm={(editedBullets) => {
            handlePreviewConfirmed(editedBullets);
            markRouteCompleted("/resume");
            navigate("/categorize");
          }}
          onBack={() => setResumeStep("upload")}
        />
      )}
    </div>
  );
}
