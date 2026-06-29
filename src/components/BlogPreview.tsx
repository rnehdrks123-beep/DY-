import React, { useState } from "react";
import { Copy, Check, Eye, Heart, MessageSquare, AlertCircle, Sparkles, Hash, Trophy, MapPin } from "lucide-react";

interface BlogPreviewProps {
  rawText: string;
  storeName: string;
  storeRegion: string;
  mainKeywords: string;
  detailKeywords: string;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({
  rawText,
  storeName,
  storeRegion,
  mainKeywords,
  detailKeywords
}) => {
  const [copiedSection, setCopiedSection] = useState<"all" | "title" | "body" | null>(null);

  if (!rawText) return null;

  // Parsing title, body, and hashtags from rawText
  const lines = rawText.split("\n").map(l => l.trim());
  
  let title = "오늘의 맛집 핫플 리뷰!";
  let contentLines: string[] = [];
  let hashtagsLine = "";

  // Typically, first non-empty line can be title
  const nonEmptyLines = lines.filter(line => line.length > 0);

  if (nonEmptyLines.length > 0) {
    title = nonEmptyLines[0];
    
    // Check if the last line contains hashtags
    const lastLine = nonEmptyLines[nonEmptyLines.length - 1];
    if (lastLine.startsWith("#") || lastLine.includes(" #")) {
      hashtagsLine = lastLine;
      contentLines = nonEmptyLines.slice(1, nonEmptyLines.length - 1);
    } else {
      contentLines = nonEmptyLines.slice(1);
    }
  }

  const cleanContent = contentLines.join("\n\n");
  const fullTextToCopy = `${title}\n\n${cleanContent}\n\n${hashtagsLine}`;

  const copyToClipboard = (text: string, section: "all" | "title" | "body") => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // SEO Metrics calculation
  const totalChars = rawText.length;
  const isCharCountValid = totalChars >= 1500;

  // Counting main keywords
  const countKeywordOccurrences = (text: string, kw: string): number => {
    if (!kw || !text) return 0;
    const cleanKw = kw.trim();
    if (!cleanKw) return 0;
    try {
      const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "gi");
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  };

  const mainKeywordCount = countKeywordOccurrences(rawText, mainKeywords);
  
  // Count detail keywords
  const detailList = detailKeywords
    ? detailKeywords.split(",").map(k => k.trim()).filter(Boolean)
    : [];
  
  const detailKeywordsMetrics = detailList.map(kw => {
    return {
      keyword: kw,
      count: countKeywordOccurrences(rawText, kw)
    };
  });

  const containsRegion = countKeywordOccurrences(rawText, storeRegion) > 0;
  
  return (
    <div className="space-y-6">
      {/* SEO SEO Optimizer Board */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mb-3.5">
          <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
          네이버 블로그 실시간 SEO 자가진단
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Char Counter */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
            <span className="block text-xs text-gray-400 font-medium mb-1">총 글자 수</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold ${isCharCountValid ? "text-emerald-600" : "text-amber-500"}`}>
                {totalChars.toLocaleString()}자
              </span>
              <span className="text-xs text-gray-400">/ 권장 1500자</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isCharCountValid ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              <span className="text-[11px] text-gray-500">
                {isCharCountValid ? "충분히 긴 고품질 글입니다!" : "조금 더 길게 작성하면 상위 노출에 유리해요"}
              </span>
            </div>
          </div>

          {/* Main Keyword Count */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
            <span className="block text-xs text-gray-400 font-medium mb-1">메인 키워드 노출</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold ${mainKeywordCount >= 3 && mainKeywordCount <= 8 ? "text-emerald-600" : "text-amber-500"}`}>
                {mainKeywordCount}회
              </span>
              <span className="text-xs text-gray-400">/ 권장 3~8회</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${mainKeywordCount >= 3 && mainKeywordCount <= 8 ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              <span className="text-[11px] text-gray-500">
                {mainKeywordCount === 0 ? "메인 키워드를 넣어주세요" : mainKeywordCount > 8 ? "반복이 다소 과해요" : "적당히 잘 스며들었습니다"}
              </span>
            </div>
          </div>

          {/* Map Region check */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
            <span className="block text-xs text-gray-400 font-medium mb-1">지역 정보 포함 여부</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-bold ${containsRegion ? "text-emerald-600" : "text-gray-400"}`}>
                {containsRegion ? "포함 완료" : "미검출"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${containsRegion ? "bg-emerald-500" : "bg-gray-300"}`}></span>
              <span className="text-[11px] text-gray-500">
                {containsRegion ? "지도 등록에 유리함" : "위치 정보를 더 녹여내면 좋습니다"}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Keywords tags tracker */}
        {detailKeywordsMetrics.length > 0 && (
          <div className="bg-white p-3 rounded-xl border border-gray-100">
            <span className="block text-xs text-gray-400 font-semibold mb-2">상세 키워드 밀도 체크</span>
            <div className="flex flex-wrap gap-1.5">
              {detailKeywordsMetrics.map((item, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    item.count > 0
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-gray-50 border-gray-100 text-gray-400 line-through"
                  }`}
                >
                  {item.keyword}
                  <span className={`ml-1 text-[10px] px-1 rounded ${item.count > 0 ? "bg-emerald-200 text-emerald-900" : "bg-gray-200 text-gray-500"}`}>
                    {item.count}회
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
        <span className="text-xs font-semibold text-gray-500">전체 또는 영역별로 간편하게 복사하세요!</span>
        <div className="flex gap-2">
          <button
            onClick={() => copyToClipboard(title, "title")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-100 cursor-pointer"
          >
            {copiedSection === "title" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">제목 복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>제목만 복사</span>
              </>
            )}
          </button>

          <button
            onClick={() => copyToClipboard(cleanContent, "body")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-100 cursor-pointer"
          >
            {copiedSection === "body" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">본문 복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>본문만 복사</span>
              </>
            )}
          </button>

          <button
            onClick={() => copyToClipboard(fullTextToCopy, "all")}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-[#03C75A] hover:bg-[#02b14f] text-white rounded-lg shadow-sm cursor-pointer"
          >
            {copiedSection === "all" ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>전체 복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>전체 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulated Naver Mobile Blog Post */}
      <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div className="bg-white max-w-[450px] mx-auto rounded-3xl overflow-hidden shadow-md border border-gray-200/60 font-sans">
          
          {/* Mobile Status Bar Simulation */}
          <div className="bg-[#03C75A] px-5 py-3 text-white flex items-center justify-between">
            <span className="text-xs font-bold font-mono tracking-wider">14:28</span>
            <span className="text-sm font-black font-sans tracking-wide">NAVER 블로그</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/40"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            </div>
          </div>

          {/* Naver Blog Profile Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                Blog
              </div>
              <div>
                <div className="text-xs font-extrabold text-gray-800 flex items-center gap-1">
                  핫플러 쏭이 💖
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded font-normal">이웃 3.2K</span>
                </div>
                <div className="text-[10px] text-gray-400">방금 전 · 네이버 맛집 전문 블로거</div>
              </div>
            </div>
            <button className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-[#03C75A] text-[11px] font-bold rounded-full transition-colors cursor-pointer">
              + 이웃추가
            </button>
          </div>

          {/* Article Container */}
          <div className="p-5 space-y-5">
            {/* Title */}
            <h1 className="text-xl font-black text-gray-950 leading-snug tracking-tight border-b border-gray-50 pb-4">
              {title}
            </h1>

            {/* Simulated Images Placeholder if needed, but we focus on pristine text flow */}
            <div className="bg-slate-50/70 border border-dashed border-gray-200 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-1.5">
                <Sparkles className="w-6 h-6 text-[#03C75A]" />
              </div>
              <p className="text-xs font-semibold text-gray-600">[{storeName}] 실제 방문 사진 들어갈 자리</p>
              <p className="text-[10px] text-gray-400 mt-1">블로그 포스팅 업로드 시, 직접 촬영한 이미지를 번갈아 삽입해 주면 노출 품질이 더욱 향상됩니다.</p>
            </div>

            {/* Post Content */}
            <div className="space-y-4 text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
              {cleanContent}
            </div>

            {/* Hashtags Section */}
            {hashtagsLine && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-start gap-1">
                  <Hash className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-emerald-600 leading-relaxed">
                    {hashtagsLine}
                  </p>
                </div>
              </div>
            )}

            {/* Location Spot Info Mockup */}
            <div className="mt-6 bg-slate-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#03C75A] text-white p-1.5 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-800">{storeName}</span>
                  <span className="block text-[10px] text-gray-400">{storeRegion}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-500 font-semibold shadow-xs">
                지도보기
              </span>
            </div>
          </div>

          {/* Footer Interactive Icons */}
          <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-gray-500 text-xs">
            <div className="flex gap-4">
              <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" /> 공감 <span className="font-semibold text-gray-700">12</span>
              </span>
              <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" /> 댓글 <span className="font-semibold text-gray-700">8</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Eye className="w-3.5 h-3.5" /> 누적 조회 241
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
