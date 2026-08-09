import React from "react";

export default function AiSuggestion({ suggestion }) {
  if (!suggestion) return null;
  return (
    <div className="mt-6 p-4 bg-panel border border-panelLine rounded-xl shadow-glass animate-fade-up" style={{ animationDelay: "180ms" }}>
      <h3 className="font-display text-lg text-paper mb-2">AI Recommendation</h3>
      <p className="text-muted font-medium whitespace-pre-wrap">{suggestion}</p>
    </div>
  );
}
