import { ImageResponse } from "next/og";
import { polygonFetch } from "@/lib/api/queries";
import { APP_TITLE } from "@/lib/utils/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;

  let name = ticker;
  let sector = "";

  try {
    const data = await polygonFetch(`/v3/reference/tickers/${ticker}`);
    name = data?.results?.name ?? ticker;
    sector = data?.results?.sic_description ?? "";
  } catch {
    // fall through — render with ticker only
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#faf9f5",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 18,
          color: "#7a7869",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {APP_TITLE}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#7a7869",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          {ticker}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            color: "#1c1a16",
            fontWeight: 400,
            lineHeight: 1,
            fontFamily: "serif",
            maxWidth: "900px",
          }}
        >
          {name}
        </div>
        {sector ? (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#7a7869",
              fontFamily: "sans-serif",
            }}
          >
            {sector}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 15,
          color: "#b0ae9e",
          fontFamily: "monospace",
          letterSpacing: "0.04em",
        }}
      >
        Stock research notebook
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
