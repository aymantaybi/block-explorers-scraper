export * from "./fetcher";

export function sanitizeRawPrice(rawPrices: string) {
  const cleanedRawPrices = rawPrices.replace(/[$,]/g, "");
  const [usdRawPrice, ethRawPrice] = cleanedRawPrices.split(" ");
  const USD = parseFloat(usdRawPrice);
  const ETH = parseFloat(ethRawPrice.match(/\d+\.\d+/)?.[0] || "0");
  return { USD, ETH };
}

export function sanitizeTotalValue(rawValue: string) {
  const cleanedRawValue = rawValue.replace(/[$,]/g, "");
  return parseFloat(cleanedRawValue);
}

export function sanitizeRawQuantity(rawQuantity: string) {
  const cleanedRawQuantity = rawQuantity.replace(/[,]/g, "");
  return parseFloat(cleanedRawQuantity);
}

export function sanitizeRawRecordsFound(rawRecordsFound: string) {
  const regex = /<strong>(\d+)<\/strong>/;
  const match = rawRecordsFound.match(regex);
  return match ? parseInt(match[1]) : 0;
}
