
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aleen AI is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "اكتبي سؤالك أولاً"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح الذكاء الاصطناعي غير مضبوط في الخادم"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite"
    });

    const prompt = `
أنت Aleen، مساعدة تعليمية ذكية تتحدث باللغة العربية.

مهمتك:
- الإجابة عن أسئلة اللغة العربية.
- شرح مسائل الرياضيات خطوة بخطوة.
- شرح الفيزياء والقوانين والأمثلة.
- الإجابة عن أسئلة الدراسات الإسلامية باحترام ودقة.
- تبسيط المعلومات للطالبات بأسلوب واضح وسهل.
- إذا كان السؤال يحتاج خطوات، اشرحي الحل بالتدريج.
- لا تختلقي إجابات إذا لم تكوني متأكدة.
- لا تكتفي بالترحيب أو الردود العامة؛ أجيبي عن السؤال نفسه.

سؤال الطالبة:
${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.json({ reply });

  } catch (error) {
    console.error("Aleen error:", error);

    return res.status(500).json({
      error: "حدث خطأ أثناء معالجة السؤال"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aleen AI is running on port ${PORT}`);
});

