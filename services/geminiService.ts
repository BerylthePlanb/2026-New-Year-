
import { GoogleGenAI } from "@google/genai";
import { PROMPT_BASE, SCENES, ANIMALS } from "../constants";

export const generateFestiveImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 隨機選擇場景與動物
  const randomScene = SCENES[Math.floor(Math.random() * SCENES.length)];
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

  const fullPrompt = `
    ${PROMPT_BASE}
    
    RANDOM CHARACTER ELEMENT:
    Integrate subtle features of a ${randomAnimal} (such as stylish ears or tail) while keeping the face perfectly human-recognizable as the person in the photo.

    RANDOM BACKGROUND SCENE:
    ${randomScene}

    TECHNICAL SPECIFICATIONS:
    - Dominant color palette: Rich festive Red and luxury Gold.
    - Lighting: Warm, cinematic, and magical festive glow.
    - Quality: 8k, masterpiece, extremely high detail on skin texture and silk fabric.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: fullPrompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
