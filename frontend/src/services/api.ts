import axios from "axios";
import { BulletPoint } from "../types/BulletPoint";
import { AnalysisResult } from "../types/Analytics";
import { NarrativeResponse } from "../types/NarrativeAnalysis";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

export const parseResume = async (file: File): Promise<BulletPoint[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/parse-resume", formData);
  return response.data;
};

export const exportJSON = async (
  result: AnalysisResult
): Promise<Blob> => {
  const response = await api.post("/export/json", result, {
    responseType: "blob",
  });

  return response.data;
};

export const exportPDF = async (
  result: AnalysisResult
): Promise<Blob> => {
  const response = await api.post("/export/pdf", result, {
    responseType: "blob",
  });

  return response.data;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const generateNarrative = async (
  result: AnalysisResult
): Promise<NarrativeResponse> => {
  const response = await api.post("/narrative", result);
  return response.data;
};



