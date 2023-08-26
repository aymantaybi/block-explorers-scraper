import { PuppeteerLaunchOptions } from "puppeteer";

export interface HeldToken {
  address: string | undefined;
  symbol: string;
  quantity: number;
  price: {
    USD: number;
    ETH: number;
  };
}

export interface TokenHoldings {
  address: string;
  tokens: HeldToken[];
  totalETH: number;
  totalUSD: number;
}

export namespace FetchJsonResponse {
  export interface tokenholdingsHandler {
    totaleth: string;
    totalusd: string;
    usdpercentagechange: string;
    paginatetop: string;
    paginatebottom: string;
    recordsfound: string;
    layout: string;
    fixedlayout: string;
    divFav: string;
    divFav2: string;
    searchFilter: string;
  }
}

export interface ScraperOptions {
  puppeteer?: PuppeteerLaunchOptions;
}
