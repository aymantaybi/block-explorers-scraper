import { EXPLORERS_URLS } from "../constants";
import { Fetcher } from "../helpers";
import { ScraperOptions, TokenHoldings } from "../interfaces";

export abstract class BaseScraper {
  abstract network: keyof typeof EXPLORERS_URLS;
  options: ScraperOptions;
  constructor(options: ScraperOptions = {}) {
    this.options = options;
  }

  initialize() {
    return Fetcher.initialize(this.options.puppeteer);
  }

  abstract getTokenHoldings(address: string): Promise<TokenHoldings>;
}
