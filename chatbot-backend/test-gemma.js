const axios = require("axios");

async function testGemma() {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma:2b",
        prompt: "Tell me a joke",
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Response:", response.data.response);
  } catch (error) {
    console.error("❌ Error from Ollama:", error.message);
    console.error("❌ Full error:", error.response?.data || error);
  }
}

testGemma();
