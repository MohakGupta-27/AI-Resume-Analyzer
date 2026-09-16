import type { Token, User } from "../types";
import { api, storeToken } from "./client";

export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}): Promise<User> {
  return api<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: payload.full_name,
      email: payload.email,
      password: payload.password,
    }),
  });
}

export async function loginUser(email: string, password: string): Promise<Token> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const token = await api<Token>("/auth/login", {
    method: "POST",
    body,
  });
  storeToken(token.access_token);
  return token;
}

export async function fetchCurrentUser(): Promise<User> {
  return api<User>("/auth/me");
}
