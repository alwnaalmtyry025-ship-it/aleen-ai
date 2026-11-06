const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "أنت ألين، معلمة ذكية تتحدث العربية وتشرح اللغة العربية والتربية الإسلامية والرياضيات والفيزياء بدقة وبأسلوب مبسط."
    });

    const result = await model.generateContent(req.body.message);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "تعذر الاتصال بالذكاء الاصطناعي" });
  }
});

app.listen(process.env.PORT || 3000);
