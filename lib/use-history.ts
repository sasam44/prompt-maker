"use client";

import { useEffect, useState } from "react";
import type { HistoryEntry, GenerationRequest, GeneratedPrompt } from "./types";

const STORAGE_KEY = "prompt-maker-history";
const MAX_ENTRIES = 20;

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HistoryEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage may be unavailable
    }
  }, [entries, ready]);

  const addEntry = (input: GenerationRequest, result: GeneratedPrompt) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const entry: HistoryEntry = {
      id,
      createdAt: Date.now(),
      input,
      result,
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearHistory = () => {
    setEntries([]);
  };

  return { entries, addEntry, deleteEntry, clearHistory, ready };
}
