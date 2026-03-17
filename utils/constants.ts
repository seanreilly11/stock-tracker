export const OPENAI_MODEL = "gpt-4o-mini";

export const APP_NAME = "InvestPrep";

// Set to true when using the Polygon.io basic/free tier (5 API calls/min limit).
// Each StockCard makes one price API call, so the stock list is capped at 5.
export const IS_DEV_STOCK_DATA = true;

export const DEV_STOCK_LIMIT = 5;

export const NOTE_MAX_LENGTH = 350;
export const STOCK_NAME_TRUNCATE_LENGTH = 100;
export const DESCRIPTION_EXPAND_LENGTH = 200;
export const NEWS_FETCH_LIMIT = 10;
export const MAX_NEXT_TO_BUY = 3;
