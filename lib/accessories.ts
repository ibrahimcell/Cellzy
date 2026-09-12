/** Product types confirmed in the owner's brief, not a live inventory feed. */
export const accessoryCategories = [
  { id: "cases", title: "Cases", copy: "Clear, silicone, rugged or folio. A little personality. A lot of everyday protection.", items: ["Clear case", "Silicone case", "Rugged case", "Folio case", "MagSafe-compatible case", "Help me choose"] },
  { id: "protection", title: "Screen protection", copy: "Glass, privacy and camera protection. Tell us your model for the right fit.", items: ["Tempered glass protector", "Privacy glass protector", "Camera lens protector", "Protective film", "Help me choose"] },
  { id: "power", title: "Power", copy: "Cables, wall chargers, wireless charging and power banks for your daily routine.", items: ["USB-C cable", "Lightning cable", "Wall charger", "Wireless charger", "Power bank", "Help me choose"] },
  { id: "audio", title: "Audio", copy: "Wireless earbuds, wired earphones, headphones and speakers. Find your kind of sound.", items: ["Wireless earbuds", "Wired earphones", "Over-ear headphones", "Bluetooth speaker", "Help me choose"] },
  { id: "car-travel", title: "Car & travel", copy: "A secure mount, a car charger, and the adapters that keep you connected on the move.", items: ["Car charger", "Car phone mount", "MagSafe-compatible car mount", "Travel adapter", "Help me choose"] },
  { id: "extras", title: "The little extras", copy: "Grips, stands, magnetic wallets, watch bands and tablet accessories. Find your everyday extras.", items: ["Phone grip / PopSocket", "Phone stand", "Magnetic wallet", "Phone holder", "Watch band", "Tablet accessory", "Help me choose"] },
] as const;

export type AccessoryCategoryId = (typeof accessoryCategories)[number]["id"];
