
import { GoogleGenAI, Modality } from "@google/genai";
import { VEO_MODEL_NAME, DEFAULT_VIDEO_PROMPT } from '../constants';
import type { ImageFile } from '../types';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType
    },
  };
};

export const editImageWithPrompt = async (
  images: ImageFile[],
  prompt: string,
  systemPrompt: string,
  modelName: string,
  userApiKey?: string
): Promise<string> => {
  try {
    // Only use the user's provided key
    const apiKey = userApiKey;
    if (!apiKey) throw new Error("Missing API Key. Please enter your Google Gemini API Key.");

    const ai = new GoogleGenAI({ apiKey });
    const imageParts = images.map(image => fileToGenerativePart(image.dataUrl, image.mimeType));
    
    // Combine prompts.
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser prompt: "${prompt}"`;
    const textPart = { text: fullPrompt };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    // Extract the image from the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate image: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred during image generation."));
  }
};

export const generateImageDescription = async (
  editedImageBase64: string,
  mimeType: string,
  userPrompt: string,
  textModelName: string,
  userApiKey?: string
): Promise<string> => {
  try {
    const apiKey = userApiKey;
    if (!apiKey) return ""; // Fail silently for description if no key

    const ai = new GoogleGenAI({ apiKey });
    const imagePart = fileToGenerativePart(editedImageBase64, mimeType);
    const textPart = {
        text: `You are a creative marketing assistant for 'Corkbrick', a modular furniture brand.
        A user provided this prompt: "${userPrompt}".
        Based on the user's prompt and the image provided, write a short, powerful, and inspiring marketing description for the resulting scene.
        Focus on the versatility and appeal of the Corkbrick solution in this new environment. The description should be 1-2 sentences long.`
    };
    const response = await ai.models.generateContent({
        model: textModelName,
        contents: { parts: [imagePart, textPart] },
    });
    return response.text.trim();
  } catch (error) {
      console.error("Error generating image description:", error);
      // Return empty string on failure so the main feature isn't blocked
      return "";
  }
};

export const generateFilenameFromDescription = async (
  description: string,
  textModelName: string,
  userApiKey?: string
): Promise<string> => {
  try {
    const apiKey = userApiKey;
    if (!apiKey) return "corkbrick-scenario";

    const ai = new GoogleGenAI({ apiKey });
    const textPart = {
        text: `You are a file naming assistant.
        Based on the following description of an image, create a short, descriptive, file-safe filename.
        The filename should be in kebab-case (e.g., 'modern-living-room-beach-view') and be no more than 5-6 words long.
        Do not include any file extension.
        
        Description: "${description}"`
    };
    const response = await ai.models.generateContent({
        model: textModelName,
        contents: { parts: [textPart] },
    });
    // Clean up the response to ensure it's a valid filename
    return response.text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // replace multiple hyphens with a single one
  } catch (error) {
      console.error("Error generating filename:", error);
      // Return a default generic name on failure
      return "corkbrick-generated-image";
  }
};

export const generateVideoFromImage = async (
  base64ImageData: string,
  mimeType: string,
  updateStatus: (status: string) => void,
  userApiKey?: string
): Promise<Blob> => {
  
  const apiKey = userApiKey;
  if (!apiKey) throw new Error("Missing API Key for video generation.");

  const ai = new GoogleGenAI({ apiKey });

  const imagePart = {
    imageBytes: base64ImageData.split(',')[1],
    mimeType: mimeType,
  };

  updateStatus("Initializing video generation...");
  let operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt: DEFAULT_VIDEO_PROMPT,
    image: imagePart,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  updateStatus("Generating video... This may take a few minutes.");
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation completed, but no download link was found.");
  }

  updateStatus("Downloading video...");
  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const response = await fetch(`${downloadLink}&key=${apiKey}`);
  if (!response.ok) {
    throw new Error(`Failed to download video file. Status: ${response.statusText}`);
  }

  updateStatus("Done.");
  return await response.blob();
};
