import { Language } from "../lib/apiClient";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => onLanguageChange("pt")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            currentLanguage === "pt"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          PT
        </button>
        <button
          onClick={() => onLanguageChange("en")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            currentLanguage === "en"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
} 