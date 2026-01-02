
// Fix: Removed circular import of SamplePromptsData from itself.

export interface ImageFile {
  dataUrl: string;
  mimeType: string;
}

export interface SavedPrompt {
  name: string;
  prompt: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  prompt: string;
  originalImages: ImageFile[];
  editedImage: string;
  description?: string; // AI-generated description for the scenario
  filename?: string; // AI-generated filename for the image
}

// New types for structured sample prompts
// FIX: Added additional optional properties to PromptScenario to match the data in constants.ts.
// This resolves errors about unknown properties like 'urban', 'historic', etc.
export interface PromptScenario {
  flexibility: string;
  assembly: string;
  sustainability: string;
  urban?: string;
  coastal?: string;
  tranquil?: string;
  historic?: string;
  natural?: string;
  classic?: string;
  modern?: string;
  outdoor?: string;
}

export interface PromptSegment {
  name: string;
  prompts: PromptScenario;
}

export interface PromptCategory {
  name: string;
  segments: PromptSegment[];
}

export type SamplePromptsData = PromptCategory[];

export type ModelMode = 'standard' | 'advanced';

// Fix: Resolved issues with global type declarations for `window.aistudio`.
// By defining the `AIStudio` interface inside `declare global`, it becomes a true global type.
// This approach prevents TypeScript from creating conflicting type definitions across different modules,
// resolving errors like "subsequent property declarations must have the same type".
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Removed `readonly` modifier to resolve conflict with other declarations.
    // Made optional (?) because it is not present in standard web browsers.
    aistudio?: AIStudio;
  }
}
