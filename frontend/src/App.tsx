import { useState } from 'react';
import { BulletPoint } from './types/BulletPoint';
import { Bin } from './types/Bin';
import { AnalysisResult, Distribution } from './types/Analytics';
import { BINS } from './config/bins';
import FileUpload from './components/upload/FileUpload';
import BulletPreview from './components/upload/BulletPreview';
import BinContainer from './components/categorization/BinContainer';
import DistributionChart from './components/summary/DistributionChart';
import BinList from './components/summary/BinList';
import InsightsPanel from './components/summary/InsightsPanel';
import { exportJSON, exportPDF, downloadBlob } from './services/api';
import Button from './components/common/Button';

type AppPhase = 'upload' | 'preview' | 'categorize' | 'summary';

function App() {
  const [phase, setPhase] = useState<AppPhase>('upload');
  const [bullets, setBullets] = useState<BulletPoint[]>([]);
  const [uncategorized, setUncategorized] = useState<BulletPoint[]>([]);
  const [bins, setBins] = useState<Bin[]>(
    BINS.map((config) => ({ ...config, bullets: [] }))
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [totalBullets, setTotalBullets] = useState(0);
  const [exporting, setExporting] = useState<'json' | 'pdf' | null>(null);

  const handleFileUploaded = (extractedBullets: BulletPoint[]) => {
    setBullets(extractedBullets);
    setPhase('preview');
  };

  const handlePreviewConfirmed = (editedBullets: BulletPoint[]) => {
    setUncategorized(editedBullets);
    setTotalBullets(editedBullets.length);
    setPhase('categorize');
  };

  const handleCategorizationComplete = () => {
    const analytics = calculateAnalytics(bins);
    const result: AnalysisResult = {
      bins,
      analytics,
      timestamp: new Date().toISOString(),
    };
    setAnalysisResult(result);
    setPhase('summary');
  };

  const calculateAnalytics = (bins: Bin[]) => {
    const total = bins.reduce((sum, bin) => sum + bin.bullets.length, 0);

    const distribution: Distribution[] = bins.map((bin) => ({
      bin_id: bin.id,
      count: bin.bullets.length,
      percentage:
        total > 0 ? Math.round((bin.bullets.length / total) * 100 * 10) / 10 : 0,
    }));

    const topBin = bins.reduce((max, bin) =>
      bin.bullets.length > max.bullets.length ? bin : max
    );

    const suggestions = generateSuggestions(distribution, bins);

    return {
      distribution,
      top_category: topBin.label,
      suggestions,
    };
  };

  const generateSuggestions = (distribution: Distribution[], bins: Bin[]) => {
    const suggestions: string[] = [];

    distribution.forEach((dist) => {
      const bin = bins.find((b) => b.id === dist.bin_id);
      if (!bin) return;

      if (dist.percentage < 15 && dist.count > 0) {
        suggestions.push(
          `Consider adding more bullets to '${bin.label}' to provide a fuller picture`
        );
      } else if (dist.percentage > 40) {
        suggestions.push(
          `Strong emphasis on '${bin.label}' - this is a key part of your profile!`
        );
      } else if (dist.count === 0) {
        suggestions.push(
          `No bullets in '${bin.label}' - reflect on experiences that fit this category`
        );
      }
    });

    if (distribution.filter((d) => d.count > 0).length === bins.length) {
      suggestions.push('Well-balanced profile across all categories!');
    }

    return suggestions.slice(0, 5);
  };

  const handleExportJSON = async () => {
    if (!analysisResult) return;
    setExporting('json');
    try {
      const blob = await exportJSON(analysisResult);
      downloadBlob(
        blob,
        `career_analysis_${new Date().toISOString().split('T')[0]}.json`
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    if (!analysisResult) return;
    setExporting('pdf');
    try {
      const blob = await exportPDF(analysisResult);
      downloadBlob(
        blob,
        `career_analysis_${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const handleReset = () => {
    setPhase('upload');
    setBullets([]);
    setUncategorized([]);
    setBins(BINS.map((config) => ({ ...config, bullets: [] })));
    setAnalysisResult(null);
    setTotalBullets(0);
  };

  // Step indicator for visual progress
  const steps = [
    { id: 'upload', label: 'Upload' },
    { id: 'preview', label: 'Review' },
    { id: 'categorize', label: 'Categorize' },
    { id: 'summary', label: 'Summary' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === phase);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-[#00693E] text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl">
                Career Design Resume Analyzer
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Discover your professional identity through your experiences
              </p>
            </div>
            {phase !== 'upload' && (
              <Button
                variant="secondary"
                onClick={handleReset}
                className="!bg-transparent !text-white !border-white/50 hover:!bg-white/10 hover:!border-white"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-[#003D1C]">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${
                          index <= currentStepIndex
                            ? 'bg-white text-[#00693E]'
                            : 'bg-white/20 text-white/60'
                        }
                      `}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`
                        text-sm hidden sm:inline
                        ${index <= currentStepIndex ? 'text-white' : 'text-white/60'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-8 md:w-16 h-px mx-2
                        ${index < currentStepIndex ? 'bg-white' : 'bg-white/20'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Phase Title */}
          {phase === 'upload' && (
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-[#262626] mb-3">
                Begin Your Career Exploration
              </h2>
              <p className="text-[#525252] text-lg max-w-2xl mx-auto">
                Start by uploading your resume. We'll help you uncover patterns
                in your experiences that reveal your professional strengths.
              </p>
            </div>
          )}

          {phase === 'preview' && (
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl text-[#262626] mb-3">
                Review Your Experiences
              </h2>
            </div>
          )}

          {phase === 'categorize' && (
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl text-[#262626] mb-3">
                Categorize Your Experiences
              </h2>
              <p className="text-[#525252] max-w-2xl mx-auto">
                Reflect on each experience and place it in the category that
                best captures what it represents about you.
              </p>
            </div>
          )}

          {phase === 'summary' && (
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl text-[#262626] mb-3">
                Your Career Profile
              </h2>
              <p className="text-[#525252] max-w-2xl mx-auto">
                Here's what your experiences reveal about your professional identity.
              </p>
            </div>
          )}

          {/* Phase Content */}
          {phase === 'upload' && (
            <FileUpload onFileUploaded={handleFileUploaded} />
          )}

          {phase === 'preview' && (
            <BulletPreview
              bullets={bullets}
              onConfirm={handlePreviewConfirmed}
              onBack={() => setPhase('upload')}
            />
          )}

          {phase === 'categorize' && (
            <BinContainer
              bins={bins}
              uncategorized={uncategorized}
              totalBullets={totalBullets}
              onBinsChange={setBins}
              onUncategorizedChange={setUncategorized}
              onComplete={handleCategorizationComplete}
            />
          )}

          {phase === 'summary' && analysisResult && (
            <div className="space-y-8">
              <DistributionChart analytics={analysisResult.analytics} bins={bins} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BinList bins={bins} />
                <InsightsPanel analytics={analysisResult.analytics} />
              </div>

              {/* Export Actions */}
              <div className="bg-white border border-[#E5E5E5] rounded-md p-8">
                <div className="text-center">
                  <h3 className="font-serif text-xl text-[#262626] mb-2">
                    Save Your Analysis
                  </h3>
                  <p className="text-[#525252] mb-6">
                    Download your career profile for future reference or sharing.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="secondary"
                      onClick={handleExportJSON}
                      disabled={exporting !== null}
                    >
                      {exporting === 'json' ? 'Exporting...' : 'Download JSON'}
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      disabled={exporting !== null}
                    >
                      {exporting === 'pdf' ? 'Exporting...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#003D1C] text-white/80">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-sm">
              Career Design Resume Analyzer
            </p>
            <p className="text-xs text-white/60 mt-1">
              A tool for exploring your professional identity through self-reflection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
