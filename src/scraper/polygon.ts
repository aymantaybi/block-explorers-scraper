import { load } from "cheerio";
import { Fetcher, sanitizeRawPrice, sanitizeRawQuantity, sanitizeRawRecordsFound, sanitizeTotalValue } from "../helpers";
import { EXPLORERS_URLS } from "../constants";
import { FetchJsonResponse, TokenHoldings } from "../interfaces";
import { BaseScraper } from "./base";

export class PolygonScraper extends BaseScraper {
  network: "polygon" = "polygon";

  async getTokenHoldings(address: string) {
    const holdings: TokenHoldings = {
      address,
      tokens: [],
      totalETH: 0,
      totalUSD: 0,
    };

    const path = "tokenholdingsHandler.aspx";
    const url = new URL(path, EXPLORERS_URLS[this.network]);

    let lastPage = 1;
    const pageSize = 1000;

    url.searchParams.set("a", address);
    url.searchParams.set("ps", pageSize.toString());
    url.searchParams.set("q", "");
    url.searchParams.set("f", "0");
    url.searchParams.set("h", "1");
    url.searchParams.set("sort", "total_price_usd");
    url.searchParams.set("order", "desc");
    url.searchParams.set("order", "desc");
    url.searchParams.set("fav", "");
    url.searchParams.set("langMsg", "A total of XX tokenSS found");
    url.searchParams.set("langFilter", "Filtered by XX");
    url.searchParams.set("langFirst", "First");
    url.searchParams.set("langPage", "Page X of Y");
    url.searchParams.set("langLast", "Last");

    for (var currentPage = 1; currentPage <= lastPage; currentPage++) {
      url.searchParams.set("p", currentPage.toString());

      const [response, page] = await Fetcher.get(url.toString());

      const json: FetchJsonResponse.tokenholdingsHandler = await response?.json();

      const $ = load(`<html><body><table><tbody>${json.layout}</tbody></table></body></html>`);

      $("body > table > tbody > tr").each((index) => {
        const selector = `body > table > tbody > tr:nth-child(${index + 1}) >`;
        const address = $(`${selector} td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child(2)`).attr("title");
        if (address === undefined) return;
        const symbol = $(`${selector} td:nth-child(3)`).text();
        const rawQuantity = $(`${selector} td:nth-child(4)`).text();
        const rawPrices = $(`${selector} td:nth-child(5)`).text();
        const price = sanitizeRawPrice(rawPrices);
        const quantity = sanitizeRawQuantity(rawQuantity);
        const token = { address, symbol, quantity, price };
        holdings.tokens.push(token);
      });

      await page.close();

      const recordsFound = sanitizeRawRecordsFound(json.recordsfound);

      holdings.totalETH = sanitizeTotalValue(json.totaleth);
      holdings.totalUSD = sanitizeTotalValue(json.totalusd);

      lastPage = Math.ceil(recordsFound / pageSize);
    }

    return holdings;
  }
}
