import { IncomingHttpHeaders } from "http";
import {
  IBaseFetchParams,
  TFetcherInitialParams,
  TQuery,
  TResponse,
} from "./types";

export class Fetcher {
  public accessToken: string | null | undefined;
  public baseUrl!: string;

  constructor({
    accessToken = "",
    baseUrl = "",
  }: Partial<TFetcherInitialParams> = {}) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  addQueryParamsToUrl(url: URL, query: TQuery) {
    if (!query) return url;

    Object.keys(query).forEach((key) => {
      url.searchParams.append(key, query[key].toString());
    });

    return url;
  }

  generateUrl(path: string, { query }: IBaseFetchParams = {}) {
    const isFullPath = path.startsWith("http");

    if (!isFullPath) {
      if (!this.baseUrl)
        throw new Error(
          "Invalid URL. Set a base url or inform a full url path!"
        );

      path = `${this.baseUrl}/${path}`;
    }

    const url = new URL(path);

    if (query) this.addQueryParamsToUrl(url, query);

    return url.toString();
  }

  generateHeaders({
    accessToken,
    withAuthentication = true,
    contentType = "application/json",
  }: IBaseFetchParams = {}) {
    const headers = {
      "content-type": contentType,
      authorization:
        withAuthentication && (accessToken || this.accessToken)
          ? `Bearer ${accessToken || this.accessToken}`
          : "",
    } as IncomingHttpHeaders;

    return new Headers(headers as any);
  }

  formatBody(body: any) {
    if (body && typeof body === "object")
      return {
        body: JSON.stringify(body),
        type: "application/json",
      };

    return { body, type: null };
  }

  async doFetch<TData>(url: string, params: RequestInit) {
    const response = (await fetch(url, params)) as TResponse<TData>;

    if (!response.ok) throw new Error("Invalid response");

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("json")) response.data = await response.json();
    else if (contentType === "text/plain")
      response.data = (await response.text()) as any;

    return response;
  }

  async get<TData>(path: string, params: IBaseFetchParams = {}) {
    const url = this.generateUrl(path, params);

    return this.doFetch<TData>(url, {
      method: "GET",
      headers: this.generateHeaders(params),
    });
  }

  async post<TData>(path: string, body: any, params: IBaseFetchParams = {}) {
    const url = this.generateUrl(path, params);

    const formattedBody = this.formatBody(body);

    if (formattedBody.type && !params.contentType)
      params.contentType = formattedBody.type;

    return this.doFetch<TData>(url, {
      method: "POST",
      headers: this.generateHeaders(params),
      body: formattedBody.body,
    });
  }
}
