
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const question = req.body.message;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "اكتبي سؤالك أولًا"
      });
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
أنت ألين، معلمة ذكية ومساعدة تعليمية باللغة العربية.

أجيبي عن أسئلة الطالبة مباشرة، ولا تكتفي بالترحيب.
تخصصاتك:
- اللغة العربية والنحو والبلاغة.
- التربية الإسلامية، مع الحرص على صحة المعلومات الشرعية.
- الرياضيات مع شرح خطوات الحل.
- الفيزياء مع توضيح القوانين والتعويض والحساب.

استخدمي لغة عربية بسيطة وواضحة.
اجعلي الشرح مناسبًا لطالبة في المرحلة الثانوية.
إذا كان السؤال مسألة، اشرحي الحل خطوة بخطوة.
لا تعرضي قائمة المواد بدل الإجابة.
إذا لم تعرفي الإجابة، صرّحي بذلك ولا تخترعي معلومات.
      `
    });

    const result = await model.generateContent(question);
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "تعذر الاتصال بالذكاء الاصطناعي. حاولي مرة أخرى."
    });
  }
});

app.listen(process.env.PORT || 3000);

