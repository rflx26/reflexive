import { ReflexiveClient } from "@reflexive/sdk";

export const api = new ReflexiveClient(process.env.REFLEXIVE_API_URL ?? "http://localhost:4000");
