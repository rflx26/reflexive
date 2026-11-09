import type {
  ClaimRequest,
  ClaimResponse,
  CreateLaunchRequest,
  CreateLaunchResponse,
  GetMarketsQuery,
  MarketDetailResponse,
  MarketListResponse,
  TradeMarketRequest,
  TradeMarketResponse
} from "@reflexive/types";

export class ReflexiveClient {
  constructor(private readonly baseUrl: string) {}

  async getMarkets(query: GetMarketsQuery = {}): Promise<MarketListResponse> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }

    const search = params.toString();
    return this.request(search ? `/markets?${search}` : "/markets");
  }

  async getMarket(marketPubkey: string): Promise<MarketDetailResponse> {
    return this.request(`/markets/${encodeURIComponent(marketPubkey)}`);
  }

  async createLaunch(body: CreateLaunchRequest): Promise<CreateLaunchResponse> {
    return this.request("/tx/create-launch", { method: "POST", body });
  }

  async tradeMarket(body: TradeMarketRequest): Promise<TradeMarketResponse> {
    return this.request("/tx/trade-market", { method: "POST", body });
  }

  async claim(body: ClaimRequest): Promise<ClaimResponse> {
    return this.request("/tx/claim", { method: "POST", body });
  }

  private async request<T>(
    path: string,
    init: { method?: "GET" | "POST"; body?: unknown } = {}
  ): Promise<T> {
    // Join manually: `new URL("/x", base)` would drop any path prefix on baseUrl (e.g. ".../api").
    const url = `${this.baseUrl.replace(/\/+$/, "")}${path}`;
    const response = await fetch(url, {
      method: init.method ?? "GET",
      headers: init.body ? { "content-type": "application/json" } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}

