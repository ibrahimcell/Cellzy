export type DeviceKind = "phone" | "tablet";

export type ThreeDModel = {
  sketchfabId: string;
  creator: string;
  source: string;
  label: "High-detail model" | "Community reference";
};

export type Device = {
  brand: string;
  model: string;
  kind: DeviceKind;
  family: string;
  aliases?: string[];
  threeD?: ThreeDModel;
};

const phone = (brand: string, family: string, model: string, aliases?: string[]): Device => ({
  brand,
  family,
  model,
  kind: "phone",
  aliases,
});

const series = (brand: string, family: string, models: string[]) =>
  models.map((model) => phone(brand, family, model));

const iphones: Device[] = series("Apple", "iPhone", [
  "iPhone 5", "iPhone 5c", "iPhone 5s", "iPhone SE (1st gen)",
  "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
  "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus",
  "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone SE (2nd gen)",
  "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone SE (3rd gen)",
  "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16e", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone Air", "iPhone 17e", "iPhone 17 Pro", "iPhone 17 Pro Max",
  "iPhone 18 Pro", "iPhone 18 Pro Max", "iPhone Duo",
]);

const galaxyS: Device[] = series("Samsung", "Galaxy S", [
  "Galaxy S7", "Galaxy S7 edge", "Galaxy S8", "Galaxy S8+", "Galaxy S9", "Galaxy S9+",
  "Galaxy S10e", "Galaxy S10", "Galaxy S10+", "Galaxy S10 5G",
  "Galaxy S20", "Galaxy S20+", "Galaxy S20 Ultra", "Galaxy S20 FE",
  "Galaxy S21", "Galaxy S21+", "Galaxy S21 Ultra", "Galaxy S21 FE",
  "Galaxy S22", "Galaxy S22+", "Galaxy S22 Ultra",
  "Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra", "Galaxy S23 FE",
  "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra", "Galaxy S24 FE",
  "Galaxy S25", "Galaxy S25+", "Galaxy S25 Edge", "Galaxy S25 Ultra", "Galaxy S25 FE",
  "Galaxy S26", "Galaxy S26+", "Galaxy S26 Ultra",
]).map((device) => {
  const canadianCodes: Record<string, string[]> = {
    "Galaxy S7": ["SM-G930W8"],
    "Galaxy S8": ["SM-G950W"],
    "Galaxy S9": ["SM-G960W"],
    "Galaxy S10": ["SM-G973W"],
    "Galaxy S20 Ultra": ["SM-G988W"],
    "Galaxy S21 Ultra": ["SM-G998W"],
    "Galaxy S22 Ultra": ["SM-S908W"],
    "Galaxy S23 Ultra": ["SM-S918W"],
    "Galaxy S24 Ultra": ["SM-S928W"],
    "Galaxy S25 Ultra": ["SM-S938W"],
  };
  return { ...device, aliases: canadianCodes[device.model] };
});

const galaxyFoldables = series("Samsung", "Galaxy Z", [
  "Galaxy Fold", "Galaxy Z Fold2", "Galaxy Z Fold3", "Galaxy Z Fold4", "Galaxy Z Fold5", "Galaxy Z Fold6", "Galaxy Z Fold7",
  "Galaxy Z Flip", "Galaxy Z Flip 5G", "Galaxy Z Flip3", "Galaxy Z Flip4", "Galaxy Z Flip5", "Galaxy Z Flip6", "Galaxy Z Flip7", "Galaxy Z Flip7 FE",
]);

const galaxyNote = series("Samsung", "Galaxy Note", [
  "Galaxy Note 5", "Galaxy Note 7", "Galaxy Note 8", "Galaxy Note 9",
  "Galaxy Note10", "Galaxy Note10+", "Galaxy Note10 Lite", "Galaxy Note20", "Galaxy Note20 Ultra",
]);

const galaxyA = series("Samsung", "Galaxy A", [
  "Galaxy A01", "Galaxy A02", "Galaxy A02s", "Galaxy A03", "Galaxy A03 Core", "Galaxy A03s",
  "Galaxy A04", "Galaxy A04e", "Galaxy A04s", "Galaxy A05", "Galaxy A05s", "Galaxy A06",
  "Galaxy A10", "Galaxy A10e", "Galaxy A10s", "Galaxy A11", "Galaxy A12", "Galaxy A13", "Galaxy A14", "Galaxy A15", "Galaxy A16",
  "Galaxy A20", "Galaxy A21", "Galaxy A21s", "Galaxy A22", "Galaxy A23", "Galaxy A24", "Galaxy A25", "Galaxy A26",
  "Galaxy A30", "Galaxy A31", "Galaxy A32", "Galaxy A33", "Galaxy A34", "Galaxy A35", "Galaxy A36",
  "Galaxy A40", "Galaxy A40s", "Galaxy A41", "Galaxy A42 5G",
  "Galaxy A50", "Galaxy A50s", "Galaxy A51", "Galaxy A52", "Galaxy A52s 5G", "Galaxy A53", "Galaxy A54", "Galaxy A55", "Galaxy A56", "Galaxy A60",
  "Galaxy A70", "Galaxy A71", "Galaxy A72", "Galaxy A73 5G",
]);

const pixels = series("Google", "Pixel", [
  "Pixel", "Pixel XL", "Pixel 2", "Pixel 2 XL", "Pixel 3", "Pixel 3 XL", "Pixel 3a", "Pixel 3a XL",
  "Pixel 4", "Pixel 4 XL", "Pixel 4a", "Pixel 4a 5G", "Pixel 5", "Pixel 5a",
  "Pixel 6", "Pixel 6 Pro", "Pixel 6a", "Pixel 7", "Pixel 7 Pro", "Pixel 7a",
  "Pixel 8", "Pixel 8 Pro", "Pixel 8a", "Pixel Fold",
  "Pixel 9", "Pixel 9 Pro", "Pixel 9 Pro XL", "Pixel 9a", "Pixel 9 Pro Fold",
  "Pixel 10", "Pixel 10 Pro", "Pixel 10 Pro XL", "Pixel 10 Pro Fold",
]);

const motorola = [
  ...series("Motorola", "Moto G", [
    "Moto G5", "Moto G5 Plus", "Moto G6", "Moto G6 Plus", "Moto G7", "Moto G7 Plus", "Moto G7 Power",
    "Moto G8", "Moto G8 Power", "Moto G9 Plus", "Moto G Power (2020)", "Moto G Power (2021)",
    "Moto G Power 5G (2023)", "Moto G Power 5G (2024)", "Moto G 5G (2023)", "Moto G 5G (2024)",
    "Moto G Stylus 5G (2022)", "Moto G Stylus 5G (2023)", "Moto G Stylus 5G (2024)", "Moto G Stylus 5G (2025)",
  ]),
  ...series("Motorola", "Razr", [
    "Motorola razr (2019)", "Motorola razr 5G", "Motorola razr (2022)",
    "Motorola razr (2023)", "Motorola razr+ (2023)", "Motorola razr (2024)", "Motorola razr+ (2024)",
    "Motorola razr (2025)", "Motorola razr Ultra (2025)",
  ]),
  ...series("Motorola", "Edge", [
    "Motorola Edge", "Motorola Edge+", "Motorola Edge 20", "Motorola Edge 20 Pro", "Motorola Edge 30", "Motorola Edge 30 Pro",
    "Motorola Edge 40", "Motorola Edge 40 Pro", "Motorola Edge 50 Fusion", "Motorola Edge 50 Pro", "Motorola Edge 50 Ultra",
  ]),
  ...series("Motorola", "Moto Z", [
    "Moto Z Force Droid", "Moto Z Play Droid", "Moto Z2 Force", "Moto Z2 Play", "Moto Z3", "Moto Z3 Play", "Moto Z4",
  ]),
  ...series("Motorola", "Motorola One", [
    "Motorola One", "Motorola One Action", "Motorola One 5G Ace", "Motorola One Vision",
  ]),
];

const onePlus = series("OnePlus", "OnePlus", [
  "OnePlus 6", "OnePlus 6T", "OnePlus 7", "OnePlus 7 Pro", "OnePlus 7T", "OnePlus 7T Pro",
  "OnePlus 8", "OnePlus 8 Pro", "OnePlus 8T", "OnePlus 9", "OnePlus 9 Pro", "OnePlus 9R",
  "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 11", "OnePlus 12", "OnePlus 12R", "OnePlus 13", "OnePlus 13R",
  "OnePlus Open", "OnePlus Nord N10 5G", "OnePlus Nord N20 5G", "OnePlus Nord N30 5G",
]);

const lg = [
  ...series("LG", "LG G", [
    "LG G2", "LG G3", "LG G4", "LG G5", "LG G6", "LG G7 ThinQ", "LG G7 One",
    "LG G8 ThinQ", "LG G8S ThinQ", "LG G8X ThinQ",
  ]),
  ...series("LG", "LG Stylo", [
    "LG Stylo", "LG Stylo 2", "LG Stylo 2 Plus", "LG Stylo 3", "LG Stylo 3 Plus",
    "LG Stylo 4", "LG Stylo 4 Plus", "LG Stylo 5", "LG Stylo 5 Plus", "LG Stylo 6",
  ]),
  ...series("LG", "LG V", ["LG V20", "LG V30", "LG V35 ThinQ", "LG V40 ThinQ", "LG V50 ThinQ", "LG V60 ThinQ"]),
  ...series("LG", "LG Velvet", ["LG Velvet", "LG Velvet 5G"]),
  ...series("LG", "LG Wing", ["LG Wing 5G"]),
];

const xiaomi = [
  ...series("Xiaomi", "Xiaomi", [
    "Xiaomi 11", "Xiaomi 11 Pro", "Xiaomi 11 Ultra", "Xiaomi 12", "Xiaomi 12 Pro", "Xiaomi 12T Pro",
    "Xiaomi 13", "Xiaomi 13 Pro", "Xiaomi 13 Ultra", "Xiaomi 14", "Xiaomi 14 Pro", "Xiaomi 14 Ultra",
    "Xiaomi 15", "Xiaomi 15 Pro", "Xiaomi 15 Ultra",
  ]),
  ...series("Xiaomi", "Redmi Note", [
    "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 12", "Redmi Note 12 Pro",
    "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 14", "Redmi Note 14 Pro",
  ]),
];

const rawDevices = [
  ...iphones,
  ...galaxyS,
  ...galaxyFoldables,
  ...galaxyNote,
  ...galaxyA,
  ...pixels,
  ...motorola,
  ...onePlus,
  ...lg,
  ...xiaomi,
];

const threeDModels: Record<string, NonNullable<Device["threeD"]>> = {
  "Apple::iPhone 14 Pro Max": {
    sketchfabId: "95f11f5a06604c8b9fd44046ae52a9cc",
    creator: "akshatmittal",
    source: "https://sketchfab.com/3d-models/iphone-14-pro-max-95f11f5a06604c8b9fd44046ae52a9cc",
    label: "High-detail model",
  },
  "Apple::iPhone 15 Pro Max": {
    sketchfabId: "98895eae0d5c421dbc7fc834a61b947a",
    creator: "Apple Inc.",
    source: "https://sketchfab.com/3d-models/iphone-15-pro-max-natural-titanium-98895eae0d5c421dbc7fc834a61b947a",
    label: "High-detail model",
  },
  "Apple::iPhone 16 Pro Max": {
    sketchfabId: "41a071ae12794b668502f58d1e0fd1a3",
    creator: "MajdyModels",
    source: "https://sketchfab.com/3d-models/iphone-16-pro-max-41a071ae12794b668502f58d1e0fd1a3",
    label: "High-detail model",
  },
  "Apple::iPhone 17 Pro": {
    sketchfabId: "4541aa8a28324b33a2baaf81d263aaec",
    creator: "Ranguel",
    source: "https://sketchfab.com/3d-models/iphone-17-pro-4541aa8a28324b33a2baaf81d263aaec",
    label: "Community reference",
  },
  "Apple::iPhone 17 Pro Max": {
    sketchfabId: "87fc1df741384124a8ce0226d2b2058d",
    creator: "MajdyModels",
    source: "https://sketchfab.com/3d-models/iphone-17-pro-max-87fc1df741384124a8ce0226d2b2058d",
    label: "Community reference",
  },
  "Samsung::Galaxy S24 Ultra": {
    sketchfabId: "47d62c4026fb4372ae83b11bf288018c",
    creator: "Debesis6",
    source: "https://sketchfab.com/3d-models/samsung-s24-ultra-47d62c4026fb4372ae83b11bf288018c",
    label: "High-detail model",
  },
};

// Search-only alternative names. Keep one canonical device entry for each phone;
// do not turn spelling/network shorthand into duplicate models or stock claims.
// Public name sources and exclusions: docs/device-catalog-sources.md.
const searchAliases: Record<string, string[]> = {
  "Apple::iPhone SE (1st gen)": ["iPhone SE 1", "iPhone SE first generation"],
  "Apple::iPhone SE (2nd gen)": ["iPhone SE 2", "iPhone SE second generation", "iPhone SE 2020"],
  "Apple::iPhone SE (3rd gen)": ["iPhone SE 3", "iPhone SE third generation", "iPhone SE 2022"],
  "Google::Pixel 5a": ["Pixel 5a 5G"],
  "Motorola::Motorola Edge": ["Moto Edge"],
  "Motorola::Motorola Edge 20": ["Moto Edge 20"],
  "Motorola::Motorola One": ["Moto One"],
  "Motorola::Motorola One Action": ["Moto One Action"],
  "Motorola::Motorola One 5G Ace": ["Moto One 5G Ace"],
  "Motorola::Motorola One Vision": ["Moto One Vision"],
};

export const devices = rawDevices.map((device) => ({
  ...device,
  aliases: [...(device.aliases ?? []), ...(searchAliases[`${device.brand}::${device.model}`] ?? [])],
  threeD: threeDModels[`${device.brand}::${device.model}`],
}));

export const deviceBrands = ["Apple", "Samsung", "Google", "Motorola", "OnePlus", "LG", "Xiaomi"];

export function matchesDevice(device: Device, query: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]/g, "");
  // Keep short generation queries distinct from the SE's 2020/2022 year aliases.
  const seGeneration = normalize(query).match(/^(?:apple)?(?:iphone)?se([123])$/)?.[1];
  if (seGeneration) {
    const generationName = ["1st", "2nd", "3rd"][Number(seGeneration) - 1];
    return device.brand === "Apple" && device.model === `iPhone SE (${generationName} gen)`;
  }
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean).map(normalize);
  const haystack = normalize([device.brand, device.family, device.model, ...(device.aliases ?? [])].join(" "));
  return words.every((word) => haystack.includes(word));
}

export const featuredModels = [
  "iPhone 13 Pro Max",
  "iPhone 15 Pro Max",
  "iPhone 17 Pro Max",
  "Galaxy S24 Ultra",
  "Galaxy S26 Ultra",
  "Pixel 10 Pro",
];
