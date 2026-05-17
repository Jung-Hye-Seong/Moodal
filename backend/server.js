const express = require("express");
const cors = require("cors");
const { Mistral } = require("@mistralai/mistralai");

const app = express();
const port = 4000;

app.use(express.json());

app.use(cors({
  origin: "https://moodal.vercel.app"
}));

const client = new Mistral({
  apiKey: "eB6qrTGyIgKLKrSAcxaURlrhE0IsPidD"
});
const conversations = new Map();
const temMemory = [];
app.post("/get-response", async (req, res) => {
  try {
    const { userId, prompt } = req.body;

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

      conversationId = response.conversationId || response.conversation_id;

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

    const output = response.outputs?.[0]?.content || "No response";
		temMemory.push({ "user": prompt, "ai": output });
    const color = await getColorCode();
    console.log("Color Code:", color);
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

app.get("/call-memory", (req, res) => {
  res.json({
    temMemory
  });
});

async function getColorCode() {
	const response = await client.chat.complete({
		model: "mistral-large-latest",
		messages: [
			{
				role: "user",
				content: `
You will analyze the conversation and choose the single most fitting color category from the list below.

Categories:
0 = Red → Passion, Love, Energy, Courage, Power
1 = Orange → Creativity, Warmth, Fun, Adventure, Optimism
2 = Yellow → Happiness, Brightness, Hope, Cheerfulness, Positivity
3 = Green → Nature, Growth, Balance, Health, Freshness
4 = Blue → Calmness, Trust, Stability, Intelligence, Peace
5 = Purple → Mystery, Luxury, Imagination, Wisdom, Magic
6 = Black → Elegance, Strength, Authority, Depth, Sophistication
7 = White → Purity, Simplicity, Cleanliness, Innocence, Clarity (Basic Mode)

Rules:
- Return ONLY one number from 0 to 7.
- Do not explain your reasoning.
- Do not output any extra text.
- Choose the category that best matches the overall emotional tone, atmosphere, personality of the conversation or mentioned colors.

Conversation:
${temMemory
	.map(m => `User: ${m.user}\nAI: ${m.ai}`)
	.join("\n")}
`
			}
		]
	});

	return response.choices[0].message.content;
}

app.listen(port, () => {
  console.log(`Server running`);
});
