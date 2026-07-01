import { useState, useEffect } from "react";
import { ReviewForm } from "./components/ReviewForm";
import { BlogPreview } from "./components/BlogPreview";
import { ReviewHistory } from "./components/ReviewHistory";
import { ReviewInput, ReviewHistoryItem } from "./types";
import { Sparkles, CheckCircle2, AlertCircle, BookOpen, PenTool, Layout, ChevronRight, Share2, HelpCircle } from "lucide-react";

export default function App() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("naver_blog_review_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          setSelectedItem(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ReviewHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("naver_blog_review_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const handleGenerateReview = async (input: ReviewInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        let serverError = "블로그 포스팅 생성 중 문제가 발생했습니다.";
        try {
          const errData = JSON.parse(errText);
          serverError = errData.error || serverError;
        } catch {
          if (errText.includes("<html") || errText.includes("<!DOCTYPE")) {
            serverError = `서버 일시 과부하 또는 네트워크 에러 (${response.status}). 잠시 후 다시 시도해 주세요.`;
          } else {
            serverError = errText.substring(0, 150) || serverError;
          }
        }
        throw new Error(serverError);
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.error || "블로그 포스팅 생성 중 문제가 발생했습니다.");
      }

      // Parse Title out from the output
      const rawText = data.text || "";
      const lines = rawText.split("\n").map((l: string) => l.trim()).filter(Boolean);
      const title = lines[0] || "오늘의 추천 맛집 후기!";

      const newItem: ReviewHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        input,
        generatedText: rawText,
        title,
        content: rawText, // Stored as is
        hashtags: lines[lines.length - 1]?.startsWith("#") ? lines[lines.length - 1] : "",
      };

      const updatedHistory = [newItem, ...history];
      saveHistory(updatedHistory);
      setSelectedItem(newItem);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버와 연결하는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated[0] || null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("정말로 모든 작성 기록을 삭제하시겠습니까?")) {
      saveHistory([]);
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 antialiased font-sans">
      {/* Dynamic Navigation/Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#03C75A] flex items-center justify-center text-white shadow-sm shadow-[#03C75A]/20">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
                AI 네이버 블로그 리뷰 생성기
              </h1>
              <p className="text-[10px] text-gray-400 font-medium">맛집 인플루언서 블로거 감성의 생생한 리뷰 & SEO 최적화</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://blog.naver.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-100 cursor-pointer"
            >
              네이버 블로그 바로가기
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Card */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-950/10">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 translate-y-12 w-48 h-48 bg-teal-600/15 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-emerald-200 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              맛집 인플루언서 블로거 감성
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-3">
              가게 정보만 입력하면,<br />
              상위노출 1500자 리뷰가 뚝딱!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
              로봇 같은 번역 투나 획일적인 문장이 아닌, 맛집·핫플 블로거 특유의 생생하고 자연스러운 표현력, 풍부한 이모지 묘사, 그리고 핵심 키워드 밀도 분석까지 원스톱으로 작성해 드립니다. 💖
            </p>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Form and History */}
          <div className="lg:col-span-5 space-y-6">
            <ReviewForm onSubmit={handleGenerateReview} isLoading={isLoading} />
            
            <ReviewHistory
              history={history}
              selectedId={selectedItem?.id || null}
              onSelect={(item) => setSelectedItem(item)}
              onDelete={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
            />
          </div>

          {/* Right Side: Preview & SEO analysis */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="relative mb-6">
                  {/* Glowing core animation */}
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#03C75A] relative animate-spin-slow">
                    <PenTool className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-[#03C75A]/10 blur-md -z-10 animate-pulse"></div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-5 h-5 text-[#03C75A] animate-pulse" />
                  네이버 블로그 포스팅 작성 중
                </h3>
                
                <div className="max-w-md space-y-2.5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    입력하신 식당/카페의 특징을 분석하여, 실제로 갓 다녀온 듯한 생생한 흐름으로 1,500자 이상의 정성 글을 빌드하고 있습니다.
                  </p>
                  
                  {/* Visual loader progress bar simulation */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-4">
                    <div className="bg-gradient-to-r from-emerald-400 to-[#03C75A] h-full rounded-full animate-loading-bar"></div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                    <span>⚡ 키워드 자연스럽게 배분 중</span>
                    <span>📍 위치 정보 결합 중</span>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 rounded-full bg-red-100/80 text-red-600 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1.5">리뷰 생성에 실패했습니다</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="px-4.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  확인 및 다시 시도하기
                </button>
              </div>
            ) : selectedItem ? (
              <BlogPreview
                rawText={selectedItem.generatedText}
                storeName={selectedItem.input.store_name}
                storeRegion={selectedItem.input.store_region}
                mainKeywords={selectedItem.input.main_keywords}
                detailKeywords={selectedItem.input.detail_keywords}
              />
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">리뷰를 만나볼 준비 완료!</h3>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                  왼쪽 폼에서 매장 정보를 알차게 적고 버튼을 누르시면, 우측에 네이버 블로그 시뮬레이터와 실시간 SEO 진단 결과가 실시간으로 노출됩니다. ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t border-gray-100 mt-20 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-400 font-medium space-y-1">
          <p>© 2026 AI Naver Blog Post Builder. All rights reserved.</p>
          <p className="text-gray-400/80">본 툴은 Gemini AI를 활용하여 블로그 글 작성을 보조하는 서비스이며, 실제 네이버 블로그 업로드 시에는 개인 스타일과 사진을 보완하시면 좋습니다.</p>
        </div>
      </footer>
    </div>
  );
}
