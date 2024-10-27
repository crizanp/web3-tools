// app/translation/hooks/useTransliterate.ts
import Sanscript from "@sanskrit-coders/sanscript";

export default function useTransliterate(wordMappings: Record<string, string>) {
  const transliterate = (input: string): string => {
    let output = '';
    const words = input.trim().split(/\s+/);

    words.forEach((word, index) => {
      const lowerWord = word.toLowerCase();
      if (wordMappings[lowerWord]) {
        output += wordMappings[lowerWord];
      } else {
        // Use Sanscript to transliterate from ITRANS (Romanized) to Devanagari
        const translatedWord = Sanscript.t(lowerWord, "itrans", "devanagari");
        output += translatedWord;
      }

      if (index < words.length - 1) {
        output += ' ';
      }
    });

    return output;
  };

  return { transliterate };
}
