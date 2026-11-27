import type { ElevationSpec } from "@/components/drawings/elevation-geom";
import type { PlanOpening, PlanRoom, PlanSpec } from "@/components/drawings/FloorPlan";

export const LINKS = {
  quote: "https://steelcommandercorp.com/contact/",
  phone: "tel:8447224766",
  phoneLabel: "844.722.4766",
  design: "https://steelcommandercorp.actbuildingsystems.com/",
  financing:
    "https://app.gethearth.com/financing/21326/31616/prequalify?utm_campaign=21326&utm_content=darkblue&utm_medium=contractor-website&utm_source=contractor&utm_term=31616",
  reviews: "https://steelcommandercorp.com/reviews/",
  builders: "https://www.mbcea.org/member-directory",
  faq: "https://steelcommandercorp.com/learning-center/#faqs",
  kits: "https://steelcommandercorp.com/steel-building-kits/",
  video1: "https://www.youtube.com/watch?v=W4vCFjBK5uk",
  video2: "https://youtu.be/mgVZSIEGFus",
};

/* ------------------------------------------------------------------ */
/* Hero: 60' shop with enclosed + open lean-tos                         */
/* ------------------------------------------------------------------ */
export const HERO: ElevationSpec = {
  width: 60,
  eave: 18,
  pitch: 4,
  wainscot: 4,
  cupola: true,
  openings: [
    { kind: "rollup", x: 5, w: 14, h: 14 },
    { kind: "rollup", x: 41, w: 14, h: 14 },
    { kind: "walk", x: 23.5 },
    { kind: "window", x: 29.5, y: 3.6, w: 6, h: 3.6 },
    { kind: "window", x: 22, y: 11.6, w: 16, h: 3.4 },
    { kind: "louver", x: 27, y: 20.6, w: 6, h: 2.6 },
  ],
  leanTos: [
    {
      side: "left",
      width: 16,
      high: 14.5,
      low: 10.5,
      openings: [
        { kind: "walk", x: 2.6 },
        { kind: "window", x: 8.6, y: 3.6, w: 5, h: 3.4 },
      ],
    },
    { side: "right", width: 16, high: 14.5, low: 10.5, open: true },
  ],
  trees: [
    { x: -28, h: 19, seed: 7, ghost: true },
    { x: -22.5, h: 25, seed: 3 },
    { x: 87, h: 18, seed: 5, ghost: true },
    { x: 81.5, h: 26, seed: 11 },
  ],
};

/* ------------------------------------------------------------------ */
/* Erection sequence drawing                                            */
/* ------------------------------------------------------------------ */
export const ASSEMBLY: ElevationSpec = {
  width: 40,
  eave: 16,
  pitch: 4,
  wainscot: 3.5,
  openings: [
    { kind: "rollup", x: 5, w: 14, h: 12 },
    { kind: "walk", x: 24 },
    { kind: "window", x: 29, y: 4, w: 6, h: 3.4 },
    { kind: "louver", x: 17.5, y: 17.4, w: 5, h: 2.4 },
  ],
  leanTos: [
    {
      side: "right",
      width: 14,
      high: 12.5,
      low: 9,
      openings: [{ kind: "window", x: 4.5, y: 3.8, w: 5, h: 3.2 }],
    },
  ],
  trees: [
    { x: -12, h: 21, seed: 19 },
    { x: -15.5, h: 16, seed: 23, ghost: true },
  ],
};

/* ------------------------------------------------------------------ */
/* Plan sheets                                                          */
/* ------------------------------------------------------------------ */
export interface BuildingType {
  id: string;
  name: string;
  tab: string;
  size: string;
  frame: string;
  roof: string;
  doors: string;
  ideal: string;
  blurb: string;
  url: string;
  elev: ElevationSpec;
  plan: PlanSpec;
}

const garage: BuildingType = {
  id: "garage",
  name: "Steel Garage",
  tab: "Garage",
  size: "30' × 40' × 12'",
  frame: "C-Channel",
  roof: "4:12 Gable",
  doors: "(2) 10'×10' roll-up · (2) 3070 walk",
  ideal: "2-car garage · hobby shop",
  blurb:
    "Room for two vehicles and a full workbench wall, with no wood to rot and nothing for termites to eat.",
  url: "https://steelcommandercorp.com/steel-buildings/garage-steel-buildings/",
  elev: {
    width: 30,
    eave: 12,
    pitch: 4,
    wainscot: 3.5,
    openings: [
      { kind: "rollup", x: 2.5, w: 10, h: 10 },
      { kind: "rollup", x: 14.5, w: 10, h: 10 },
      { kind: "walk", x: 25.8 },
      { kind: "louver", x: 13.5, y: 12.6, w: 3, h: 2 },
    ],
    trees: [{ x: 40, h: 17, seed: 31 }],
  },
  plan: {
    length: 40,
    width: 30,
    bay: 20,
    openings: [
      { wall: "W", at: 2.5, w: 10, kind: "rollup" },
      { wall: "W", at: 14.5, w: 10, kind: "rollup" },
      { wall: "W", at: 25.8, w: 3, kind: "walk" },
      { wall: "S", at: 30, w: 3, kind: "walk" },
      { wall: "N", at: 16, w: 4, kind: "window" },
      { wall: "S", at: 14, w: 4, kind: "window" },
      { wall: "E", at: 13, w: 4, kind: "window" },
    ],
    fixtures: [
      { kind: "car", x: 13, y: 7.5, w: 16, h: 6.6 },
      { kind: "car", x: 13, y: 19.5, w: 16, h: 6.6 },
      { kind: "bench", x: 37.6, y: 15, w: 2.4, h: 12 },
      { kind: "rack", x: 29, y: 2.6, w: 12, h: 2.2 },
    ],
    labels: [{ x: 29, y: 15, text: "SHOP AREA" }],
  },
};

const homeRooms: PlanRoom[] = [
  { x: 0, y: 0, w: 16, h: 16, label: "PRIMARY", sub: "16'×16'", door: { side: "S", at: 12 } },
  { x: 16, y: 0, w: 10, h: 9, label: "BATH", door: { side: "S", at: 1 } },
  { x: 16, y: 9, w: 10, h: 7, label: "W.I.C.", door: { side: "W", at: 2, w: 2.6 } },
  { x: 0, y: 26, w: 13, h: 14, label: "BED 2", sub: "13'×14'", door: { side: "N", at: 9 } },
  { x: 13, y: 30, w: 7, h: 10, label: "BATH", door: { side: "N", at: 1 } },
  { x: 25, y: 28, w: 11, h: 12, label: "BED 3", sub: "11'×12'", door: { side: "N", at: 1 } },
  { x: 36, y: 32, w: 6, h: 8, label: "LAUN.", door: { side: "N", at: 1.5, w: 2.6 } },
  { x: 42, y: 0, w: 18, h: 40, label: "SHOP", sub: "18'×40'", door: { side: "W", at: 19 } },
];

const home: BuildingType = {
  id: "home",
  name: "Steel Building Home",
  tab: "Barndominium",
  size: "40' × 60' × 14'",
  frame: "Rigid Frame / I-Beam",
  roof: "4:12 Gable + cupola",
  doors: "12'×12' shop door · 12' covered porch",
  ideal: "Barndominium · live/work",
  blurb:
    "Three bedrooms, an open great room and an 18' shop under one clear-span roof, so interior walls go wherever you want them.",
  url: "https://steelcommandercorp.com/steel-building-homes/",
  elev: {
    width: 40,
    eave: 14,
    pitch: 4,
    wainscot: 4,
    cupola: true,
    openings: [
      { kind: "window", x: 5, y: 3.6, w: 5, h: 4.6 },
      { kind: "window", x: 30, y: 3.6, w: 5, h: 4.6 },
      { kind: "window", x: 15, y: 14.4, w: 10, h: 3 },
      { kind: "walk", x: 18.5 },
    ],
    leanTos: [{ side: "right", width: 12, high: 11, low: 9, open: true }],
    trees: [
      { x: -9, h: 19, seed: 41 },
      { x: -12.5, h: 14, seed: 43, ghost: true },
    ],
  },
  plan: {
    length: 60,
    width: 40,
    bay: 20,
    openings: [
      { wall: "W", at: 5, w: 5, kind: "window" },
      { wall: "W", at: 30, w: 5, kind: "window" },
      { wall: "W", at: 18.5, w: 3, kind: "walk" },
      { wall: "E", at: 14, w: 12, kind: "rollup", label: "12'×12'" },
      { wall: "E", at: 31, w: 3, kind: "walk" },
      { wall: "S", at: 21, w: 3, kind: "walk" },
      { wall: "S", at: 4, w: 4, kind: "window" },
      { wall: "S", at: 28, w: 4, kind: "window" },
      { wall: "N", at: 5, w: 4, kind: "window" },
      { wall: "N", at: 30, w: 5, kind: "window" },
    ],
    rooms: homeRooms,
    fixtures: [
      { kind: "bed", x: 5.5, y: 8, w: 7, h: 6 },
      { kind: "tub", x: 21, y: 2.3, w: 5.4, h: 2.6 },
      { kind: "toilet", x: 24.2, y: 7, w: 1.6, h: 2.4 },
      { kind: "counter", x: 34, y: 1.95, w: 14, h: 2.4 },
      { kind: "island", x: 34, y: 9, w: 8, h: 3.4 },
      { kind: "sofa", x: 9, y: 20.5, w: 9, h: 3 },
      { kind: "table", x: 33, y: 21, w: 6, h: 3.4 },
      { kind: "bed", x: 5, y: 33, w: 6.6, h: 5.4 },
      { kind: "tub", x: 16.5, y: 38.1, w: 5.2, h: 2.4 },
      { kind: "toilet", x: 18.6, y: 32.3, w: 1.6, h: 2.2 },
      { kind: "bed", x: 31, y: 35.5, w: 6.6, h: 5.4 },
      { kind: "car", x: 51, y: 20, w: 16, h: 6.6 },
    ],
    leanTos: [{ side: "S", x: 0, len: 42, depth: 12, open: true, label: "COVERED PORCH · 12'" }],
    labels: [
      { x: 17, y: 23.6, text: "GREAT ROOM", big: true },
      { x: 34, y: 13.6, text: "KITCHEN" },
    ],
  },
};

const workshop: BuildingType = {
  id: "workshop",
  name: "Steel Workshop",
  tab: "Workshop",
  size: "40' × 50' × 14'",
  frame: "Rigid Frame / I-Beam",
  roof: "3:12 Gable",
  doors: "(2) 12'×12' roll-up · 12' office lean-to",
  ideal: "Fabrication · auto shop · contractor yard",
  blurb:
    "Two drive-through bays and an enclosed lean-to for the office and parts room. The clear span means no posts in the way.",
  url: "https://steelcommandercorp.com/steel-building-kits/",
  elev: {
    width: 40,
    eave: 14,
    pitch: 3,
    wainscot: 3.5,
    openings: [
      { kind: "rollup", x: 4, w: 12, h: 12 },
      { kind: "rollup", x: 24, w: 12, h: 12 },
      { kind: "louver", x: 18.5, y: 14.8, w: 3, h: 2 },
    ],
    leanTos: [
      {
        side: "left",
        width: 12,
        high: 11,
        low: 8.5,
        openings: [
          { kind: "walk", x: 1.4 },
          { kind: "window", x: 6.6, y: 3.5, w: 4, h: 3 },
        ],
      },
    ],
    trees: [{ x: 48, h: 18, seed: 53 }],
  },
  plan: {
    length: 50,
    width: 40,
    bay: 25,
    openings: [
      { wall: "W", at: 4, w: 12, kind: "rollup", label: "12'×12'" },
      { wall: "W", at: 24, w: 12, kind: "rollup", label: "12'×12'" },
      { wall: "E", at: 6, w: 3, kind: "walk" },
      { wall: "E", at: 24, w: 4, kind: "window" },
      { wall: "S", at: 10, w: 4, kind: "window" },
      { wall: "S", at: 32, w: 4, kind: "window" },
      { wall: "N", at: 12, w: 3, kind: "walk" },
    ],
    leanTos: [{ side: "N", x: 0, len: 25, depth: 12, label: "OFFICE / PARTS · 12'" }],
    fixtures: [
      { kind: "car", x: 17, y: 10, w: 15, h: 6.5 },
      { kind: "truck", x: 17, y: 30, w: 19, h: 7.5 },
      { kind: "bench", x: 47.5, y: 20, w: 2.4, h: 14 },
      { kind: "rack", x: 37, y: 37.3, w: 16, h: 2.6 },
    ],
    labels: [{ x: 37, y: 16, text: "SHOP FLOOR", big: true }],
  },
};

const hangar: BuildingType = {
  id: "hangar",
  name: "Aircraft Hangar",
  tab: "Hangar",
  size: "80' × 80' × 22'",
  frame: "Rigid Frame / I-Beam",
  roof: "1:12 Gable",
  doors: "60'×18' hydraulic · 3070 walk",
  ideal: "Private aviation · FBO · ag aviation",
  blurb:
    "An 80' clear span with a 60' hydraulic door. Room to taxi straight in, plus a pilot lounge and a parts room.",
  url: "https://steelcommandercorp.com/metal-hangar-buildings/",
  elev: {
    width: 80,
    eave: 22,
    pitch: 1,
    openings: [
      { kind: "hangar", x: 10, w: 60, h: 18 },
      { kind: "walk", x: 73.4 },
    ],
    trees: [
      { x: -10, h: 22, seed: 61 },
      { x: 92, h: 20, seed: 67 },
      { x: 96, h: 15, seed: 71, ghost: true },
    ],
  },
  plan: {
    length: 80,
    width: 80,
    bay: 26.67,
    openings: [
      { wall: "W", at: 10, w: 60, kind: "hangar", label: "60'×18' HYDRAULIC DOOR" },
      { wall: "W", at: 73.4, w: 3, kind: "walk" },
      { wall: "E", at: 6, w: 3, kind: "walk" },
      { wall: "N", at: 30, w: 5, kind: "window" },
      { wall: "S", at: 30, w: 5, kind: "window" },
    ],
    rooms: [
      { x: 62, y: 0, w: 18, h: 16, label: "PILOT LOUNGE", door: { side: "W", at: 10 } },
      { x: 62, y: 64, w: 18, h: 16, label: "PARTS", door: { side: "W", at: 3 } },
    ],
    fixtures: [{ kind: "plane", x: 31, y: 40, w: 34, h: 40 }],
  },
};

const ag: BuildingType = {
  id: "ag",
  name: "Agricultural Building",
  tab: "Ag / Equipment",
  size: "50' × 80' × 16'",
  frame: "Rigid Frame / I-Beam",
  roof: "3:12 Gable",
  doors: "24' slider · (2) 16' open lean-tos",
  ideal: "Machine shed · hay · equipment",
  blurb:
    "A full-height center bay for combines and trucks, with open lean-tos on both sides for implements and hay.",
  url: "https://steelcommandercorp.com/agriculture-steel-buildings/",
  elev: {
    width: 50,
    eave: 16,
    pitch: 3,
    openings: [
      { kind: "slider", x: 13, w: 24, h: 14 },
      { kind: "louver", x: 22.5, y: 17.4, w: 5, h: 2.5 },
    ],
    leanTos: [
      { side: "left", width: 16, high: 13, low: 9, open: true },
      { side: "right", width: 16, high: 13, low: 9, open: true },
    ],
    trees: [
      { x: -24, h: 22, seed: 73 },
      { x: -28.5, h: 16, seed: 79, ghost: true },
      { x: 74, h: 21, seed: 83 },
    ],
  },
  plan: {
    length: 80,
    width: 50,
    bay: 20,
    openings: [
      { wall: "W", at: 13, w: 24, kind: "slider" },
      { wall: "E", at: 19, w: 12, kind: "rollup", label: "12'×12'" },
      { wall: "N", at: 38, w: 3, kind: "walk" },
    ],
    leanTos: [
      { side: "N", x: 0, len: 80, depth: 16, open: true, label: "OPEN LEAN-TO · 16'" },
      { side: "S", x: 0, len: 80, depth: 16, open: true, label: "OPEN LEAN-TO · 16'" },
    ],
    fixtures: [
      { kind: "tractor", x: 20, y: 25, w: 16, h: 9 },
      { kind: "truck", x: 57, y: 25, w: 22, h: 8 },
      { kind: "tractor", x: 62, y: -8, w: 12, h: 7 },
      { kind: "rack", x: 60, y: 61, w: 24, h: 3 },
    ],
  },
};

const stalls: PlanRoom[] = [];
for (let i = 0; i < 5; i++) {
  const last = i === 4;
  stalls.push({
    x: i * 12,
    y: 0,
    w: 12,
    h: 12,
    label: last ? "TACK" : "STALL",
    sub: last ? undefined : "12'×12'",
    door: { side: "S", at: 4, w: 4 },
  });
  stalls.push({
    x: i * 12,
    y: 28,
    w: 12,
    h: 12,
    label: last ? "WASH" : "STALL",
    sub: last ? undefined : "12'×12'",
    door: { side: "N", at: 4, w: 4 },
  });
}
const stallWindows: PlanOpening[] = [];
for (let i = 0; i < 5; i++) {
  stallWindows.push({ wall: "N", at: i * 12 + 4.5, w: 3, kind: "window" });
  stallWindows.push({ wall: "S", at: i * 12 + 4.5, w: 3, kind: "window" });
}

const horse: BuildingType = {
  id: "horse",
  name: "Metal Horse Barn",
  tab: "Horse Barn",
  size: "40' × 60' × 13'",
  frame: "Rigid Frame + lean-tos",
  roof: "5:12 raised center aisle",
  doors: "(2) 12' sliders · stall windows",
  ideal: "Stables · riding arenas · tack",
  blurb:
    "A raised center-aisle barn with eight 12'×12' stalls, plus tack and wash rooms. Steel won't rot and won't burn.",
  url: "https://steelcommandercorp.com/metal-horse-barns/",
  elev: {
    width: 16,
    eave: 13,
    pitch: 5,
    wainscot: 4,
    cupola: true,
    openings: [
      { kind: "slider", x: 2, w: 12, h: 10 },
      { kind: "louver", x: 6, y: 11.8, w: 4, h: 2 },
    ],
    leanTos: [
      {
        side: "left",
        width: 12,
        high: 10,
        low: 7.5,
        openings: [{ kind: "window", x: 4.5, y: 4.4, w: 3, h: 2 }],
      },
      {
        side: "right",
        width: 12,
        high: 10,
        low: 7.5,
        openings: [{ kind: "window", x: 4.5, y: 4.4, w: 3, h: 2 }],
      },
    ],
    trees: [
      { x: -20, h: 18, seed: 89 },
      { x: 36, h: 20, seed: 97 },
      { x: 39.5, h: 15, seed: 101, ghost: true },
    ],
  },
  plan: {
    length: 60,
    width: 40,
    bay: 20,
    colRows: [12, 28],
    rooms: stalls,
    openings: [
      { wall: "W", at: 14, w: 12, kind: "slider" },
      { wall: "E", at: 14, w: 12, kind: "slider" },
      ...stallWindows,
    ],
    labels: [{ x: 30, y: 20, text: "CENTER AISLE · 16'", big: true }],
  },
};

const commercial: BuildingType = {
  id: "commercial",
  name: "Commercial Warehouse",
  tab: "Commercial",
  size: "100' × 150' × 24'",
  frame: "Rigid Frame / I-Beam",
  roof: "1:12 Gable",
  doors: "(3) dock doors · 12'×14' drive-in · storefront",
  ideal: "Distribution · retail · light industrial",
  blurb:
    "A front office with a storefront, three dock-high doors and 25' bays laid out for pallet racking.",
  url: "https://steelcommandercorp.com/steel-buildings/commercial-steel-buildings/",
  elev: {
    width: 100,
    eave: 24,
    pitch: 1,
    openings: [
      { kind: "storefront", x: 6, w: 24, h: 10 },
      { kind: "window", x: 6, y: 14, w: 24, h: 4 },
      { kind: "dock", x: 40, w: 9, h: 10 },
      { kind: "dock", x: 53, w: 9, h: 10 },
      { kind: "dock", x: 66, w: 9, h: 10 },
      { kind: "rollup", x: 82, w: 12, h: 14 },
    ],
    trees: [
      { x: -10, h: 20, seed: 103 },
      { x: 112, h: 22, seed: 107 },
    ],
  },
  plan: {
    length: 150,
    width: 100,
    bay: 25,
    openings: [
      { wall: "W", at: 6, w: 24, kind: "storefront" },
      { wall: "W", at: 40, w: 9, kind: "dock" },
      { wall: "W", at: 53, w: 9, kind: "dock" },
      { wall: "W", at: 66, w: 9, kind: "dock" },
      { wall: "W", at: 82, w: 12, kind: "rollup" },
      { wall: "E", at: 44, w: 12, kind: "rollup" },
      { wall: "S", at: 70, w: 3, kind: "walk" },
      { wall: "N", at: 120, w: 3, kind: "walk" },
    ],
    rooms: [
      { x: 0, y: 0, w: 32, h: 36, label: "OFFICE", sub: "32'×36'", door: { side: "E", at: 24 } },
      { x: 32, y: 0, w: 14, h: 16, label: "R.R.", door: { side: "S", at: 2 } },
    ],
    fixtures: [
      { kind: "table", x: 16, y: 18, w: 8, h: 4 },
      { kind: "rack", x: 98, y: 50, w: 88, h: 4 },
      { kind: "rack", x: 98, y: 64, w: 88, h: 4 },
      { kind: "rack", x: 98, y: 78, w: 88, h: 4 },
    ],
    labels: [{ x: 98, y: 28, text: "WAREHOUSE · 24' EAVE", big: true }],
  },
};

const units: PlanRoom[] = [];
const unitDoors: PlanOpening[] = [
  { wall: "W", at: 2.5, w: 10, kind: "rollup" },
  { wall: "W", at: 17.5, w: 10, kind: "rollup" },
];
for (let i = 0; i < 12; i++) {
  units.push({ x: i * 10, y: 0, w: 10, h: 15, label: String(101 + i) });
  units.push({ x: i * 10, y: 15, w: 10, h: 15, label: String(201 + i) });
  if (i > 0) {
    unitDoors.push({ wall: "N", at: i * 10 + 1, w: 8, kind: "rollup" });
    unitDoors.push({ wall: "S", at: i * 10 + 1, w: 8, kind: "rollup" });
  }
}

const storage: BuildingType = {
  id: "storage",
  name: "Self Storage",
  tab: "Self Storage",
  size: "30' × 120' × 9'",
  frame: "Rigid Frame / I-Beam",
  roof: "½:12 Single slope",
  doors: "(24) roll-up unit doors",
  ideal: "Mini-storage · RV & boat storage",
  blurb:
    "Back-to-back 10'×15' units with drive-up roll-up doors on both sides. Add more runs as occupancy grows.",
  url: "https://steelcommandercorp.com/self-storage-building-kits/",
  elev: {
    width: 30,
    eave: 9,
    pitch: 0.5,
    roof: "single",
    openings: [
      { kind: "rollup", x: 2.5, w: 10, h: 7 },
      { kind: "rollup", x: 17.5, w: 10, h: 7 },
    ],
    trees: [
      { x: 40, h: 16, seed: 109 },
      { x: -8, h: 13, seed: 113, ghost: true },
    ],
  },
  plan: {
    length: 120,
    width: 30,
    bay: 20,
    rooms: units,
    openings: unitDoors,
  },
};

export const BUILDINGS: BuildingType[] = [
  garage,
  home,
  workshop,
  hangar,
  ag,
  horse,
  commercial,
  storage,
];

export const USES = [
  { label: "Agricultural Steel Buildings", url: "https://steelcommandercorp.com/agriculture-steel-buildings/" },
  { label: "Storage Steel Building", url: "https://steelcommandercorp.com/self-storage-building-kits/" },
  { label: "Aircraft Hangar Steel Buildings", url: "https://steelcommandercorp.com/metal-hangar-buildings/" },
  { label: "Workshop Steel Building", url: "https://steelcommandercorp.com/2022/08/01/steel-building-garages-arizona/" },
  { label: "Commercial Steel Buildings", url: "https://steelcommandercorp.com/steel-buildings/commercial-steel-buildings/" },
  { label: "Garage Steel Buildings", url: "https://steelcommandercorp.com/steel-buildings/garage-steel-buildings/" },
  { label: "Livestock Steel Building", url: "https://steelcommandercorp.com/steel-farm-buildings/" },
  { label: "Industrial Steel Buildings", url: "https://steelcommandercorp.com/steel-warehouse-buildings/" },
  { label: "Horse Barn Steel Buildings", url: "https://steelcommandercorp.com/metal-horse-barns/" },
  { label: "Recreational Steel Buildings", url: "https://steelcommandercorp.com/steel-buildings/recreational-steel-buildings/" },
  { label: "Sports Steel Buildings", url: "https://steelcommandercorp.com/steel-buildings/sports-steel-buildings/" },
  { label: "Residential Home Steel Building", url: "https://steelcommandercorp.com/steel-building-homes/" },
];

export const CLIENTS = [
  { name: "PGA Tour", src: "/scc/cust-pga.jpg" },
  { name: "Pfizer", src: "/scc/cust-pfizer.jpg" },
  { name: "Cadillac", src: "/scc/cust-cadillac.jpg" },
  { name: "McDonald's", src: "/scc/cust-mcdonalds.jpg" },
  { name: "Six Flags", src: "/scc/cust-six-flags.jpg" },
  { name: "Terex", src: "/scc/cust-terex.jpg" },
  { name: "Honda", src: "/scc/cust-honda.jpg" },
  { name: "Seminole Tribe of Florida", src: "/scc/cust-seminole-trip.jpg" },
];
