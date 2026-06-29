import React, { useState } from "react";
import { ReviewInput } from "../types";
import { Sparkles, MapPin, Link2, Key, List, FileText, CheckCircle2, RotateCcw } from "lucide-react";

interface ReviewFormProps {
  onSubmit: (input: ReviewInput) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "☕ 연남동 감성 카페",
    input: {
      store_region: "서울 마포구 연남동",
      store_name: "카페 연남숲 (Cafe Yeonnam Forest)",
      place_link: "https://m.place.naver.com/restaurant/12345678/home",
      main_keywords: "연남동 카페 추천",
      detail_keywords: "연남동 디저트 맛집, 감성 카페, 아인슈페너 맛집, 햇살 맛집",
      extra_info: "화이트&우드 톤의 차분한 인테리어, 사장님이 매일 직접 굽는 수제 제철 과일 타르트가 진짜 바삭함, 통창 너머로 초록초록한 가로수가 보여서 뷰가 미쳤음.",
      tone_option: "통통 튀고 귀여운 말투 (이모지 듬뿍)",
    }
  },
  {
    name: "🥩 성수동 삼겹살 맛집",
    input: {
      store_region: "서울 성동구 성수동",
      store_name: "성수 무쇠 솥뚜껑구이",
      place_link: "https://m.place.naver.com/restaurant/87654321/home",
      main_keywords: "성수동 고기집",
      detail_keywords: "성수동 삼겹살 맛집, 미나리 삼겹살, 성수 핫플, 모임 장소 추천, 볶음밥 필수",
      extra_info: "국내산 암돼지 삼겹살만 취급함, 향긋한 미나리를 산더미처럼 서비스로 얹어줘서 삼겹살이랑 조합이 대박임, 고소한 무쇠 솥뚜껑 기름에 볶아먹는 볶음밥이 숨은 꿀맛 포인트.",
      tone_option: "동네 친한 언니처럼 털털하고 유쾌한 말투 (내돈내산 감성)",
    }
  },
  {
    name: "🍣 광안리 오션뷰 스시",
    input: {
      store_region: "부산 수영구 광안해변로",
      store_name: "부산 해맞이 스시",
      place_link: "https://m.place.naver.com/restaurant/10293847/home",
      main_keywords: "광안리 맛집 추천",
      detail_keywords: "광안리 오션뷰 맛집, 부산 여행 코스, 신선한 모듬사시미, 광안대교 전망",
      extra_info: "저녁에 가면 통유리로 광안대교 드론쇼가 한눈에 펼쳐짐, 셰프님이 한 피스씩 서빙하면서 해산물 원산지와 즐기는 방법을 꼼꼼하게 알려주심, 대접받는 느낌 물씬.",
      tone_option: "차분하고 감성 가득한 일기장 스타일의 리뷰 말투",
    }
  }
];

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<ReviewInput>({
    store_region: "",
    store_name: "",
    place_link: "",
    main_keywords: "",
    detail_keywords: "",
    extra_info: "",
    tone_option: "통통 튀고 귀여운 말투 (이모지 듬뿍)"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReviewInput, string>>>({});

  const applyPreset = (presetInput: ReviewInput) => {
    setForm(presetInput);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ReviewInput]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ReviewInput, string>> = {};
    if (!form.store_region.trim()) newErrors.store_region = "매장 위치나 지역을 적어주세요 (예: 서울 마포구 연남동)";
    if (!form.store_name.trim()) newErrors.store_name = "매장명은 필수 정보입니다";
    if (!form.main_keywords.trim()) newErrors.main_keywords = "검색 노출을 위한 메인 키워드를 입력해 주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const handleReset = () => {
    setForm({
      store_region: "",
      store_name: "",
      place_link: "",
      main_keywords: "",
      detail_keywords: "",
      extra_info: "",
      tone_option: "통통 튀고 귀여운 말투 (이모지 듬뿍)"
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Preset Pickers */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          빠른 체험을 위한 추천 맛집 템플릿
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applyPreset(preset.input)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Region & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#03C75A]" />
              매장 지역 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="store_region"
              value={form.store_region}
              onChange={handleInputChange}
              placeholder="예: 서울 마포구 연남동"
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.store_region ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#03C75A]/20"
              } focus:border-[#03C75A] focus:outline-none focus:ring-4 text-sm transition-all`}
            />
            {errors.store_region && <p className="text-xs text-red-500 mt-1">{errors.store_region}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#03C75A]" />
              매장명 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="store_name"
              value={form.store_name}
              onChange={handleInputChange}
              placeholder="예: 카페 연남숲"
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.store_name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#03C75A]/20"
              } focus:border-[#03C75A] focus:outline-none focus:ring-4 text-sm transition-all`}
            />
            {errors.store_name && <p className="text-xs text-red-500 mt-1">{errors.store_name}</p>}
          </div>
        </div>

        {/* Play Link */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <Link2 className="w-4 h-4 text-[#03C75A]" />
            네이버 플레이스 링크 (선택)
          </label>
          <input
            type="url"
            name="place_link"
            value={form.place_link}
            onChange={handleInputChange}
            placeholder="예: https://m.place.naver.com/restaurant/..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#03C75A] focus:ring-[#03C75A]/20 focus:outline-none focus:ring-4 text-sm transition-all"
          />
        </div>

        {/* Row 2: Main & Detail Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Key className="w-4 h-4 text-[#03C75A]" />
              메인 키워드 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="main_keywords"
              value={form.main_keywords}
              onChange={handleInputChange}
              placeholder="예: 연남동 카페 추천"
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.main_keywords ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#03C75A]/20"
              } focus:border-[#03C75A] focus:outline-none focus:ring-4 text-sm transition-all`}
            />
            {errors.main_keywords && <p className="text-xs text-red-500 mt-1">{errors.main_keywords}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <List className="w-4 h-4 text-[#03C75A]" />
              상세 키워드들 (선택)
            </label>
            <input
              type="text"
              name="detail_keywords"
              value={form.detail_keywords}
              onChange={handleInputChange}
              placeholder="쉼표(,)로 구분: 감성 카페, 아인슈페너, 조용한 분위기"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#03C75A] focus:ring-[#03C75A]/20 focus:outline-none focus:ring-4 text-sm transition-all"
            />
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            블로그 리뷰 말투 테마
          </label>
          <select
            name="tone_option"
            value={form.tone_option}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#03C75A] focus:ring-[#03C75A]/20 focus:outline-none focus:ring-4 text-sm transition-all bg-white"
          >
            <option value="통통 튀고 귀여운 말투 (이모지 듬뿍)">
              맛집 인플루언서의 통통 튀고 귀여운 말투 (이모지 듬뿍, 일상적인 이모티콘 다수)
            </option>
            <option value="동네 친한 언니처럼 털털하고 유쾌한 말투 (내돈내산 감성)">
              친한 친구처럼 털털하고 유쾌한 솔직 말투 (리얼한 내돈내산 느낌)
            </option>
            <option value="차분하고 감성 가득한 일기장 스타일의 리뷰 말투">
              차분하고 감성적인 에세이/일기장 스타일 (인스타 감성의 서정적 어투)
            </option>
            <option value="트렌디하고 힙한 신세대 얼리어답터 말투">
              트렌디하고 힙스터 감성이 돋보이는 핫플 전문 리뷰 말투
            </option>
          </select>
        </div>

        {/* Extra Info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <FileText className="w-4 h-4 text-[#03C75A]" />
            추가 특징 및 참고 정보 (선택)
          </label>
          <textarea
            name="extra_info"
            value={form.extra_info}
            onChange={handleInputChange}
            rows={3}
            placeholder="인테리어 분위기, 사장님의 친절함, 꼭 시켜야 하는 시그니처 메뉴 등 생생하게 담고 싶은 디테일한 포인트를 자유롭게 적어주세요!"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#03C75A] focus:ring-[#03C75A]/20 focus:outline-none focus:ring-4 text-sm transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-md transition-all ${
              isLoading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-[#03C75A] hover:bg-[#02b14f] active:scale-[0.98] cursor-pointer"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "리뷰 글 쓰는 중..." : "AI 네이버 블로그 리뷰 생성"}
          </button>
        </div>
      </form>
    </div>
  );
};
