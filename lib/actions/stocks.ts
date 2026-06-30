"use server";
import { revalidatePath } from "next/cache";
import { requireUid } from "@/lib/session";
import {
  addStock,
  updateStock,
  removeStock,
  addNote,
  deleteNote,
  addToNextToBuy,
  removeFromNextToBuy,
  addTarget,
  removeTarget,
  acknowledgeTarget,
  updateStockThesis,
  getOrCreateStock,
} from "@/lib/data";
import { TTargetKind, TStockConviction, TStockTag, TNoteKind } from "@/types";

export async function addStockAction(ticker: string, name: string) {
  const uid = await requireUid();
  const stock = await addStock(uid, ticker, name);
  await addNote(stock.id, uid, `Added ${ticker} to watchlist.`, "plan", [
    "onboarding",
  ]);
  revalidatePath("/");
}

export async function addStockWithConfigAction(
  ticker: string,
  name: string,
  config: {
    conviction?: TStockConviction;
    tag?: TStockTag;
    buyPrice?: number;
    buyNote?: string;
    trimPrice?: number;
    trimNote?: string;
    thesis?: string;
  },
) {
  const uid = await requireUid();
  const stock = await addStock(
    uid,
    ticker,
    name,
    config.conviction,
    config.tag,
  );

  // Onboarding plan note - inserted first so it's oldest (anchors bottom of timeline)
  const targetCount = (config.buyPrice ? 1 : 0) + (config.trimPrice ? 1 : 0);
  const targetSummary =
    targetCount > 0
      ? ` Set ${targetCount} target${targetCount > 1 ? "s" : ""}.`
      : "";
  const thesisSummary = config.thesis?.trim() ? " Initial thesis seeded." : "";
  await addNote(
    stock.id,
    uid,
    `Added ${ticker} to watchlist.${targetSummary}${thesisSummary}`,
    "plan",
    ["onboarding"],
  );

  // Targets (no individual notes - plan note summarises the initial setup)
  if (config.buyPrice)
    await addTarget(
      stock.id,
      uid,
      "buy",
      config.buyPrice,
      config.buyNote ?? "",
    );
  if (config.trimPrice)
    await addTarget(
      stock.id,
      uid,
      "sell",
      config.trimPrice,
      config.trimNote ?? "",
    );

  // Thesis note last - newest timestamp, appears above plan note in the timeline
  if (config.thesis?.trim())
    await addNote(stock.id, uid, config.thesis.trim(), "thesis");
  revalidatePath("/");
}

export async function updateStockAction(
  stockId: string,
  updates: {
    most_recent_price?: number | null;
  },
  ticker: string,
) {
  const uid = await requireUid();
  await updateStock(stockId, updates);
  revalidatePath(`/stocks/${ticker}`);
  revalidatePath("/");
}

export async function removeStockAction(stockId: string) {
  const uid = await requireUid();
  await removeStock(stockId);
  revalidatePath("/");
}

export async function addNoteAction(
  stockId: string | undefined,
  text: string,
  ticker: string,
  name: string,
  kind?: TNoteKind,
  tags?: string[],
) {
  const uid = await requireUid();
  const resolvedId = stockId ?? (await getOrCreateStock(uid, ticker, name));
  if (!stockId) revalidatePath("/");
  await addNote(resolvedId, uid, text, kind, tags);
  revalidatePath(`/stocks/${ticker}`);
}

export async function deleteNoteAction(noteId: string, ticker: string) {
  const uid = await requireUid();
  await deleteNote(noteId);
  revalidatePath(`/stocks/${ticker}`);
}

export async function addToNextToBuyAction(ticker: string) {
  const uid = await requireUid();
  await addToNextToBuy(uid, ticker);
  revalidatePath("/");
}

export async function removeFromNextToBuyAction(ticker: string) {
  const uid = await requireUid();
  await removeFromNextToBuy(uid, ticker);
  revalidatePath("/");
}

export async function addTargetAction(
  stockId: string | undefined,
  ticker: string,
  name: string,
  kind: TTargetKind,
  price: number,
  label: string,
) {
  const uid = await requireUid();
  const resolvedId = stockId ?? (await getOrCreateStock(uid, ticker, name));
  if (!stockId) revalidatePath("/");
  await addTarget(resolvedId, uid, kind, price, label);
  await addNote(
    resolvedId,
    uid,
    `Set ${kind} target at $${price.toFixed(2)}${label ? ` - ${label}` : ""}.`,
    "target",
    ["plan"],
  );
  revalidatePath(`/stocks/${ticker}`);
}

export async function removeTargetAction(targetId: string, ticker: string) {
  await requireUid();
  await removeTarget(targetId);
  revalidatePath(`/stocks/${ticker}`);
}

export async function acknowledgeTargetAction(
  targetId: string,
  ticker: string,
) {
  await requireUid();
  await acknowledgeTarget(targetId);
  revalidatePath(`/stocks/${ticker}`);
}

export async function updateThesisAction(
  stockId: string | undefined,
  thesis: string,
  ticker: string,
  name: string,
) {
  if (!thesis) return;
  const uid = await requireUid();
  const resolvedId = stockId ?? (await getOrCreateStock(uid, ticker, name));
  if (!stockId) revalidatePath("/");
  await updateStockThesis(resolvedId, thesis);
  revalidatePath(`/stocks/${ticker}`);
}
