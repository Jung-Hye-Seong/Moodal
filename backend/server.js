const express = require("express");
const cors = require("cors");
const { Mistral } = require("@mistralai/mistralai");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
  origin: "https://moodal.vercel.app"
}));

const client = new Mistral({
  apiKey: "eB6qrTGyIgKLKrSAcxaURlrhE0IsPidD"
});

const conversations = new Map();
const memories = new Map();

app.post("/get-response", async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId required"
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: "prompt required"
      });
    }

    let conversationId = conversations.get(userId);

    let response;

    if (!conversationId) {
      response = await client.beta.conversations.start({
        agentId: "ag_019e26387c94718da2fb9af5720bafe6",
        inputs: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      conversationId =
        response.conversationId ||
        response.conversation_id;

      conversations.set(userId, conversationId);
    }

    else {
      response = await client.beta.conversations.append({
        conversationId,
        conversationAppendRequest: {
          inputs: [
            {
              role: "user",
              content: prompt
            }
          ]
        }
      });
    }

    const output =
      response.outputs?.[0]?.content ||
      "No response";

    if (!memories.has(userId)) {
      memories.set(userId, []);
    }

    const userMemory = memories.get(userId);

    userMemory.push({
      user: prompt,
      ai: output
    });

    const color = await getColorCode(userMemory);

    res.json({
      response: output,
      colorCode: color,
      conversationId
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/call-memory/:userId", (req, res) => {
  const { userId } = req.params;

  const userMemory =
    memories.get(userId) || [];

  res.json({
    temMemory: userMemory
  });
});

async function getColorCode(memory) {
  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: `
You will analyze the conversation and choose the single most fitting color category from the list below.

Categories:
0 = Red
1 = Orange
2 = Yellow
3 = Green
4 = Blue
5 = Purple
6 = Black
7 = White

Rules:
- Return ONLY one number from 0 to 7.
- Do not explain.
- No extra text.

Conversation:
${memory
  .map(m => `User: ${m.user}\nAI: ${m.ai}`)
  .join("\n")}
`
      }
    ]
  });

  return response.choices[0].message.content;
}

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
