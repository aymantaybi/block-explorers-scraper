import { Browser, HTTPResponse, Page, PuppeteerLaunchOptions } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import invariant from "tiny-invariant";

puppeteer.use(StealthPlugin());

export class Fetcher {
  static browser: Browser | undefined;

  static isInitialized() {
    return this.browser !== undefined;
  }

  static async initialize(options: PuppeteerLaunchOptions = {}) {
    if (this.isInitialized()) return;
    this.browser = await puppeteer.launch({
      targetFilter: (target) => !!target.url(),
      headless: "new",
      ...options,
    });
  }

  static get(url: string) {
    return this.request(url, "GET", undefined);
  }

  static async request(url: string, method: "GET" | "POST", data: any = undefined): Promise<[HTTPResponse | null, Page]> {
    invariant(this.browser !== undefined, "Fetcher Not Initialized");
    const page = await this.browser.newPage();
    let response = await page.goto(url);
    const text = await response?.text();
    if (text?.includes("<title>Just a moment...</title>")) {
      response = await page.waitForResponse((response) => response.ok() && response.url() === url);
    }
    return [response, page];
  }
}
