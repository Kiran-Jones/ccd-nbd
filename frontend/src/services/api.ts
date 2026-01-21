import axios from 'axios';
import { BulletPoint } from '../types/BulletPoint';
import { AnalysisResult } from '../types/Analytics';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const parseResume = async (file: File): Promise<BulletPoint[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE}/parse-resume`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const exportJSON = async (result: AnalysisResult): Promise<Blob> => {
  const response = await axios.post(`${API_BASE}/export/json`, result, {
    responseType: 'blob',
  });

  return response.data;
};

export const exportPDF = async (result: AnalysisResult): Promise<Blob> => {
  const response = await axios.post(`${API_BASE}/export/pdf`, result, {
    responseType: 'blob',
  });

  return response.data;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
