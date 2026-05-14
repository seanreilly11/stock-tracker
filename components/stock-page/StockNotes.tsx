"use client";
import React, { useState, FormEvent, Suspense } from "react";
import { addNoteAction } from "@/lib/actions/stocks";
import { TStock, TNote, TNoteKind, AINotes } from "@/types";
import Button from "@/components/ui/Button";
import EditNotesButton from "./EditNotesButton";
import AINotesList from "./AINotesList";
import EmptyState from "@/components/common/EmptyState";
import KbdShortcut from "@/components/ui/KbdShortcut";

const NOTE_KINDS: TNoteKind[] = ["observation", "thesis", "plan"];
const KIND_LABELS: Record<TNoteKind, string> = {
  observation: "Observation",
  thesis: "Thesis",
  plan: "Plan",
  alert: "Alert",
  earnings: "Earnings",
  target: "Target",
};
const KIND_COLOURS: Partial<Record<TNoteKind, string>> = {
  alert: "bg-[var(--accent-soft)] text-[var(--accent)]",
  target: "bg-[var(--green-soft)] text-[var(--green)]",
  earnings: "bg-[var(--ink)] text-[var(--paper)]",
};

const KIND_DOT: Record<TNoteKind, string> = {
  observation: "bg-[var(--paper)] border-[var(--ink-3)]",
  thesis: "bg-[var(--paper)] border-[var(--ink-2)]",
  plan: "bg-[var(--paper)] border-[var(--ink-3)] border-dashed",
  target: "bg-[var(--paper)] border-[var(--green)]",
  earnings: "bg-[var(--ink)] border-[var(--ink)]",
  alert: "bg-[var(--accent)] border-[var(--accent)]",
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface StockNotesProps {
  ticker: string;
  name: string;
  type: string;
  stock: TStock;
  notes: TNote[];
  aiNotesPromise: Promise<AINotes[] | null>;
}

const AINotesLoading = () => (
  <div className="mt-4 flex flex-col gap-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-10 rounded-md bg-[var(--paper-2)] animate-pulse"
      />
    ))}
  </div>
);

const StockNotes = ({
  ticker,
  name,
  type,
  stock,
  notes,
  aiNotesPromise,
}: StockNotesProps) => {
  const [noteText, setNoteText] = useState("");
  const [kind, setKind] = useState<TNoteKind>("observation");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const NOTE_MAX = 500;

  const parseTags = (raw: string) =>
    raw
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, ""))
      .filter(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      const tags = parseTags(tagsInput);
      await addNoteAction(
        stock.id,
        noteText.trim(),
        ticker,
        kind,
        tags.length ? tags : undefined,
      );
      setNoteText("");
      setTagsInput("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-7 sm:mt-10">
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-5">
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          Notes &amp; observations
        </span>
        <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">
          {notes.length} entries
        </span>
      </div>

      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] mb-6 overflow-hidden">
        <textarea
          className="w-full px-4 py-3.5 font-[family-name:var(--serif)] text-base leading-relaxed bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)] placeholder:italic outline-none resize-none min-h-[80px]"
          placeholder="What changed? What did you read? What are you watching for?"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          maxLength={NOTE_MAX}
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 sm:px-3 sm:py-2 border-t border-[var(--rule)] bg-[var(--paper-2)]">
          <div className="flex gap-1 overflow-x-auto">
            {NOTE_KINDS.map((k) => (
              <button
                key={k}
                className={`font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.06em] px-2.5 py-1 rounded border transition-colors ${
                  kind === k
                    ? "bg-[var(--paper)] border-[var(--rule)] text-[var(--ink)]"
                    : "bg-transparent border-transparent text-[var(--ink-3)] hover:bg-[var(--paper-3)]"
                }`}
                onClick={() => setKind(k)}
                type="button"
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="#tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-28 bg-transparent border border-[var(--rule)] rounded px-2 py-1 font-[family-name:var(--mono)] text-[11px] text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
            />
            <span className="text-[10px] text-[var(--ink-4)] font-[family-name:var(--mono)]">
              {noteText.length}/{NOTE_MAX}
            </span>
            <KbdShortcut>⌘↵</KbdShortcut>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              loading={saving}
            >
              Save note
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<AINotesLoading />}>
        <AINotesList
          ticker={ticker}
          name={name}
          type={type}
          stock={stock}
          aiNotesPromise={aiNotesPromise}
        />
      </Suspense>

      {notes.length > 0 ? (
        <div className="relative pl-7 mt-6">
          <div className="absolute left-1.5 top-3.5 bottom-3.5 w-px bg-[var(--rule)]" />
          {notes.map((note: TNote) => {
            const noteKind = (note.kind ?? "observation") as TNoteKind;
            return (
              <article key={note.id} className="relative pb-5">
                <span
                  className={`absolute -left-[26px] top-5 w-2.5 h-2.5 rounded-full border-[1.5px] ${KIND_DOT[noteKind]}`}
                />
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5 font-[family-name:var(--mono)] text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[var(--ink-3)] mb-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${KIND_COLOURS[noteKind] ?? "bg-[var(--paper-3)] text-[var(--ink-2)]"}`}
                  >
                    {KIND_LABELS[noteKind]}
                  </span>
                  <span className="hidden sm:inline text-[var(--ink-4)]">
                    {new Date(note.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {new Date(note.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[var(--ink-4)] normal-case tracking-normal">
                    {timeAgo(note.created_at)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-[family-name:var(--serif)] text-[15px] sm:text-base leading-relaxed text-[var(--ink)] flex-1">
                    {note.text}
                  </p>
                  <EditNotesButton note={note} stock={stock} ticker={ticker} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState page="Notes" />
      )}
    </section>
  );
};

export default StockNotes;
