import React, { useState } from "react";
import { ReviewHistoryItem } from "../types";
import { History, Calendar, Trash2, ChevronRight, Search, FileEdit, X } from "lucide-react";

interface ReviewHistoryProps {
  history: ReviewHistoryItem[];
  onSelect: (item: ReviewHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  selectedId: string | null;
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  selectedId,
}) => {
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.input.store_name.toLowerCase().includes(search.toLowerCase()) ||
      item.input.main_keywords.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <History className="w-4 h-4 text-[#03C75A]" />
          작성한 리뷰 기록 ({history.length})
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-red-500 font-medium cursor-pointer transition-colors"
          >
            기록 전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
          <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">아직 생성된 리뷰 기록이 없어요.</p>
          <p className="text-xs text-gray-400/80 mt-1">왼쪽 폼에 맛집 정보를 넣고 리뷰를 만들어보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="매장명 또는 키워드 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 focus:border-[#03C75A] focus:ring-4 focus:ring-[#03C75A]/10 focus:outline-none rounded-xl transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* History list */}
          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">검색된 기록이 없습니다.</p>
            ) : (
              filteredHistory.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`group relative flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-emerald-50/40 border-emerald-200 ring-2 ring-emerald-50"
                        : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div
                      onClick={() => onSelect(item)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.timestamp)}
                        </span>
                        <span className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md font-semibold truncate max-w-[120px]">
                          {item.input.store_region.split(" ").slice(-1)[0] || item.input.store_region}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-gray-800 truncate mb-0.5">
                        {item.input.store_name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {item.title}
                      </p>
                    </div>

                    <div className="flex items-center ml-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        title="기록 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
