export type Device = { brand: string; model: string; kind: "phone" | "tablet" };

const variants = (brand: string, family: string, years: number[], suffixes: string[] = [""]) =>
  years.flatMap((year) => suffixes.map((suffix) => ({ brand, model: `${family} ${year}${suffix}`, kind: "phone" as const })));

const iphones: Device[] = [
  ...variants("Apple", "iPhone", [7, 8], ["", " Plus"]),
  ...["iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone SE (2nd gen)", "iPhone SE (3rd gen)"].map((model) => ({ brand: "Apple", model, kind: "phone" as const })),
  ...variants("Apple", "iPhone", [11], ["", " Pro", " Pro Max"]),
  ...variants("Apple", "iPhone", [12, 13], [" mini", "", " Pro", " Pro Max"]),
  ...variants("Apple", "iPhone", [14, 15, 16], ["", " Plus", " Pro", " Pro Max"]),
  ...variants("Apple", "iPhone", [17], ["", " Air", " Pro", " Pro Max"]),
];

const galaxyS: Device[] = variants("Samsung", "Galaxy S", Array.from({ length: 20 }, (_, index) => index + 7), ["", " Plus", " Ultra"]);
const samsungOther: Device[] = [
  ...variants("Samsung", "Galaxy Note", [8, 9, 10, 20], ["", " Ultra"]),
  ...variants("Samsung", "Galaxy Z Fold", [1, 2, 3, 4, 5, 6, 7]),
  ...variants("Samsung", "Galaxy Z Flip", [1, 2, 3, 4, 5, 6, 7]),
  ...variants("Samsung", "Galaxy A", [10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 32, 33, 34, 35, 42, 51, 52, 53, 54, 55, 56, 70, 71, 72, 73]),
];

const pixels: Device[] = [
  ...variants("Google", "Pixel", [2, 3, 4, 5, 6, 7, 8, 9, 10], ["", " Pro"]),
  ...["Pixel 3a", "Pixel 4a", "Pixel 5a", "Pixel 6a", "Pixel 7a", "Pixel 8a", "Pixel 9a", "Pixel Fold", "Pixel 9 Pro Fold"].map((model) => ({ brand: "Google", model, kind: "phone" as const })),
];

const motorola: Device[] = [
  ...variants("Motorola", "moto g", [5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 75, 80, 85]),
  ...["razr 2019", "razr 5G", "razr 2022", "razr 2023", "razr+ 2023", "razr 2024", "razr+ 2024", "Edge", "Edge+", "Edge 20", "Edge 30", "Edge 40", "Edge 50"].map((model) => ({ brand: "Motorola", model, kind: "phone" as const })),
];

const others: Device[] = [
  ...variants("OnePlus", "OnePlus", [7, 8, 9, 10, 11, 12, 13], ["", " Pro"]),
  ...variants("LG", "LG G", [6, 7, 8]),
  ...variants("Xiaomi", "Xiaomi", [11, 12, 13, 14, 15], ["", " Pro", " Ultra"]),
];

export const devices = [...iphones, ...galaxyS, ...samsungOther, ...pixels, ...motorola, ...others];

export const featuredModels = [
  "iPhone 17 Pro Max",
  "iPhone 16 Pro",
  "Galaxy S26 Ultra",
  "Galaxy Z Fold 7",
  "Pixel 10 Pro",
  "Motorola razr 2024",
];
