import { EXPLORERS_URLS } from "./constants";
import { Fetcher } from "./helpers";

const path = "tokenholdingsHandler.aspx";

const url = new URL(path, EXPLORERS_URLS.polygon);

const address = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

url.searchParams.set("a", address);

(async () => {
  await Fetcher.initialize();

  const response = await Fetcher.get(
    "https://polygonscan.com/tokenholdingsHandler.aspx?&a=0xBA12222222228d8Ba445958a75a0704d566BF2C8&q=&p=1&f=0&h=1&sort=total_price_usd&order=desc&pUsd24hrs=0.5511&pBtc24hrs=0.0000211665568401925&pUsd=0.5571&fav=&langMsg=A%20total%20of%20XX%20tokenSS%20found&langFilter=Filtered%20by%20XX&langFirst=First&langPage=Page%20X%20of%20Y&langLast=Last&ps=100"
  );

  console.log(await response?.json());
})();
