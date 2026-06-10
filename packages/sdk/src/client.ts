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

    return this.request(`/markets?${params.toString()}`);
  }

  async getMarket(marketPubkey: string): Promise<MarketDetailResponse> {
    return this.request(`/markets/${marketPubkey}`);
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
    const response = await fetch(new URL(path, this.baseUrl), {
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

