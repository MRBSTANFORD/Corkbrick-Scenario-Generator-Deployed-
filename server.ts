import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality, GenerateVideosOperation } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = 3000;

const getGenAIClient = (req: express.Request) => {
  const customKey = req.headers.authorization?.replace('Bearer ', '');
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API Key. Please provide one or set GEMINI_API_KEY environment variable.');
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });
};

function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType,
    },
  };
}

// Edit Image
app.post('/api/gemini/edit-image', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { images, prompt, systemPrompt, modelName } = req.body;
    
    const imageParts = images.map((image: any) => fileToGenerativePart(image.dataUrl, image.mimeType));
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser prompt: "${prompt}"`;
    const textPart = { text: fullPrompt };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [...imageParts, textPart] },
      config: { responseModalities: [Modality.IMAGE] },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return res.json({ generatedImageBase64: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
      }
    }
    throw new Error('No image was generated in the response.');
  } catch (error: any) {
    console.error('Error in edit-image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Description
app.post('/api/gemini/generate-description', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { editedImageBase64, mimeType, userPrompt, textModelName } = req.body;
    
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
    
    res.json({ description: response.text?.trim() || '' });
  } catch (error: any) {
    console.error('Error in generate-description:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Filename
app.post('/api/gemini/generate-filename', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { description, textModelName } = req.body;

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
    
    const filename = (response.text || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
      
    res.json({ filename: filename || 'corkbrick-scenario' });
  } catch (error: any) {
    console.error('Error in generate-filename:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Video - Start
app.post('/api/gemini/generate-video', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { base64ImageData, mimeType, modelName, prompt } = req.body;
    
    const operation = await ai.models.generateVideos({
      model: modelName,
      prompt: prompt,
      image: {
        imageBytes: base64ImageData.split(',')[1],
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Error in generate-video:', error);
    
    let msg = error.message || "";
    if (msg.includes("403") || msg.includes("permission") || msg.includes("API key not valid")) {
      msg = "Your API key does not have permission for Video Generation. This requires a Google Cloud project with billing enabled.";
    } else if (msg.includes("404") || msg.includes("not found")) {
      msg = "The Video Generation model (Veo) is currently unavailable in your region or for your specific API key.";
    } else if (msg.includes("quota") || msg.includes("429")) {
      msg = "You have reached the temporary rate limit for video generation. Please wait a few minutes before trying again.";
    }
    
    res.status(500).json({ error: msg });
  }
});

// Generate Video - Poll
app.post('/api/gemini/video-status', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { operationName } = req.body;
    
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    
    res.json({ done: updated.done });
  } catch (error: any) {
    console.error('Error in video-status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Video - Download
app.post('/api/gemini/video-download', async (req, res) => {
  try {
    const ai = getGenAIClient(req);
    const { operationName } = req.body;
    
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error('Video URI not found on completed operation.');

    // We must fetch it with the api key
    const customKey = req.headers.authorization?.replace('Bearer ', '');
    const apiKey = customKey || process.env.GEMINI_API_KEY || '';

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
        throw new Error('Failed to download video file.');
    }

    res.setHeader('Content-Type', 'video/mp4');
    videoRes.body!.pipeTo(
      new WritableStream({
        write(chunk) { res.write(chunk); },
        close() { res.end(); },
      })
    );
  } catch (error: any) {
    console.error('Error in video-download:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
