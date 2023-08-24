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

  static async initialize() {
    if (this.isInitialized()) return;
    const options: PuppeteerLaunchOptions = {
      targetFilter: (target) => !!target.url(),
      headless: "new",
    };
    this.browser = await puppeteer.launch(options);
  }

  static async get(url: string) {
    await this.initialize();
    return this.request(url, "GET");
  }

  static async request(url: string, method: "GET" | "POST", data: any = undefined) {
    invariant(this.browser !== undefined, "INITIALIZED");
    const page = await this.browser.newPage();
    if (method !== "GET") {
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        request.continue({ method, postData: data });
      });
    }
    await page.goto(url);
    const response = await page.waitForResponse((response) => response.url() === url && response.status() === 200);
    return response;
  }
}
