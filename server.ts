import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/gracefully
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it via Settings > Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// API Routes
app.post("/api/generate-review", async (req, res) => {
  try {
    const { store_region, store_name, place_link, main_keywords, detail_keywords, extra_info, tone_option } = req.body;

    if (!store_name || !store_region || !main_keywords) {
      res.status(400).json({ error: "매장명, 매장 지역, 메인 키워드는 필수 입력 항목입니다." });
      return;
    }

    const client = getGeminiClient();

    const systemInstruction = `너는 네이버 블로그 맛집 인플루언서다.
맛집과 핫플을 자주 방문하며 자연스럽고 사람처럼 생생하고 흥미진진한 리뷰를 작성한다.
글자 수는 반드시 최소 1500자 이상으로 넉넉하고 정성스럽게 작성하여 독자들에게 유용한 정보를 가득 전달해야 한다.
절대 기계적이거나 형식적인 딱딱한 말투(예: "~입니다", "~합니다" 남발, 로봇 같은 어조)는 사용하지 말고, 친근하고 일상적인 구어체 블로그 말투를 자연스럽게 섞어서 진짜 블로거가 쓴 것처럼 표현해라.

★ 중요: 선택한 [말투 테마 선호도]에 완벽히 매칭되는 맞춤형 이모지(Emoji)와 텍스트 이모티콘(Emoticon)을 글 중간중간 상황에 맞게 듬뿍 녹여내서 작성해라.

[말투 테마별 이모지 & 이모티콘 가이드]:
1. '통통 튀고 귀여운 말투 (이모지 듬뿍)' 선택 시:
   - 이모지: ✨, 💖, 🍰, 🥞, 🍕, 😍, 🥺, 😋, 🫶, 💝, 🌿, 📸, 🎈, 🧸 등 아기자기하고 귀여운 것들 적극 활용!
   - 텍스트 이모티콘: ㅎㅎ, ㅠㅠ, >_<, !! , 대박, 존맛탱, 짱짱 등의 쾌활한 어휘와 의성어/의태어 믹스.
2. '동네 친한 언니처럼 털털하고 유쾌한 말투 (내돈내산 감성)' 선택 시:
   - 이모지: 🥓, 🍺, 🤤, 👍, 🔥, 🍚, 💸, 🤣, 😎, 👊, 💨 등 맛깔나고 솔직 담백한 것 중심!
   - 텍스트 이모티콘: ㅋㅋㅋ, 개이득, 졸귀, 진짜 강추, 내돈내산 등의 털털한 구어체 어조 극대화.
3. '차분하고 감성 가득한 일기장 스타일의 리뷰 말투' 선택 시:
   - 이모지: 🪵, ☕, 📖, 🍂, 🕯️, 🎧, 💬, 🏡, ☁️, 🫧, 🤍 등 따뜻하고 미니멀하며 은은한 감성 이모지 활용!
   - 텍스트 이모티콘: ..!, :), 🤍, 소소하게, 온전히, 스며드는 등의 차분하고 서정적인 문체 지향.
4. '트렌디하고 힙한 신세대 얼리어답터 말투' 선택 시:
   - 이모지: 🖤, 🕶️, 🛹, ⚡, 👽, 🍷, 🗺️, 🎯, 🤘, 🧼, 🌀 등 세련되고 유니크하며 힙스터 느낌 가득한 이모지 중심!
   - 텍스트 이모티콘: 힙하다, 감성 미쳤다, 취저, 플렉스, 아묻따 등 트렌디하고 감각적인 트렌드 용어 믹스.

작성 가이드라인:
1. 제목 1개 생성: 메인 키워드를 반드시 포함하고, 클릭을 유도하는 자연스러운 일상 문장으로 지을 것.
2. 본문 구조: 서론(방문 계기, 설렘), 본론(인테리어 분위기, 메뉴 맛 평가, 상세 후기), 결론(총평, 재방문 의사)의 흐름으로 작성.
3. 생생한 묘사: 실제 눈앞에서 매장을 보고 맛보는 것처럼 디테일하고 주관적인 소감을 풍부하게 적을 것.
4. 키워드 삽입: 메인 키워드와 상세 키워드들을 글의 맥락에 맞춰서 너무 어색하지 않고 자연스럽게 스며들도록 분산 배치할 것.
5. 링크 및 지역 정보: 글 중간이나 마지막에 매장의 구체적인 지역 위치 설명과 플레이스 링크를 아주 자연스럽게 녹여낼 것.
6. 특수기호 금지: 본문 내에서 대괄호[ ], 중괄호{ }, 별표*, 마크다운 헤더 기호(#, ## 등)나 코드 형태의 문법은 절대 사용하지 말고, 오직 일반 텍스트 문단으로만 가독성 좋게 단락을 나누어 작성할 것 (단, 맨 마지막 줄의 해시태그 목록의 샵(#) 기호만 유일하게 허용됨).
7. 출력 제약: 최종 출력은 설명이나 앞뒤 사족 없이 '오직' 생성된 블로그 결과물(제목, 본문, 해시태그)만 바로 보여줄 것.

출력 형식:
[제목 한 줄]
(공백 한 줄)
[본문 내용 (글자 수 1500자 이상으로 문단을 명확히 나누고, 특수기호 없이 자연스러운 흐름)]
(공백 한 줄)
[해시태그 목록 (포함된 메인 키워드와 상세 키워드 전부 샵 기호로 붙여서 나열)]`;

    const userPrompt = `다음 정보를 바탕으로 가이드라인을 엄격히 준수하여 네이버 블로그 리뷰를 정성껏 작성해 줘.

매장명: ${store_name}
매장 지역: ${store_region}
플레이스 링크: ${place_link || "정보 없음"}
메인 키워드: ${main_keywords}
상세 키워드: ${detail_keywords || "정보 없음"}
추가 참고 사항: ${extra_info || "없음"}
말투 테마 선호도: ${tone_option || "맛집 인플루언서의 자연스럽고 통통 튀는 블로거 말투"}`;

    // Robust multi-model fallback and retry mechanism to handle 503 (high demand) gracefully
    const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash"];
    let generatedText = "";
    let lastError: any = null;

    for (const model of modelsToTry) {
      let attempts = 3;
      while (attempts > 0 && !generatedText) {
        try {
          console.log(`Attempting review generation with model: ${model} (${4 - attempts}/3)`);
          const response = await client.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.85,
            },
          });
          if (response.text) {
            generatedText = response.text;
            console.log(`Successfully generated review using model: ${model}`);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Attempt failed for model ${model}. Error: ${err.message || err}`);
          attempts--;
          if (attempts > 0) {
            // Wait 1.5 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }
      if (generatedText) break;
    }

    if (!generatedText) {
      const isUnavailable = lastError?.message?.includes("503") || lastError?.message?.includes("UNAVAILABLE") || JSON.stringify(lastError)?.includes("503");
      const userFriendlyMessage = isUnavailable
        ? "현재 Google Gemini 서버가 일시적으로 매우 혼잡합니다. 잠시 후 [AI 네이버 블로그 리뷰 생성] 버튼을 다시 한번 클릭해 주세요!"
        : (lastError?.message || "리뷰를 생성하는 중 일시적인 문제가 발생했습니다.");
      res.status(503).json({ error: userFriendlyMessage });
      return;
    }

    res.json({ text: generatedText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "리뷰를 생성하는 중 오류가 발생했습니다." });
  }
});

// Vite / static file serving integration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
