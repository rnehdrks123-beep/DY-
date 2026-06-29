export interface ReviewInput {
  store_region: string;
  store_name: string;
  place_link: string;
  main_keywords: string;
  detail_keywords: string;
  extra_info: string;
  tone_option: string;
}

export interface ReviewHistoryItem {
  id: string;
  timestamp: number;
  input: ReviewInput;
  generatedText: string;
  title: string;
  content: string;
  hashtags: string;
}
