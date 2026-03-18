import { useState, useEffect, useRef } from "react";

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY;

function loadData() {
  try {
    const r = localStorage.getItem("nozl_v2");
    return r ? JSON.parse(r) : { prices: {}, custom: [] };
  } catch {
    return { prices: {}, custom: [] };
  }
}
function saveData(d) {
  try {
    localStorage.setItem("nozl_v2", JSON.stringify(d));
  } catch {}
}

const C = {
  bg: "#050510",
  card: "#0a0a2e",
  card2: "#0f0f3a",
  border: "#1a1aff33",
  border2: "#00eeff33",
  accent: "#00eeff",
  accent2: "#00ffff",
  text: "#e0f7ff",
  text2: "#6a9ab0",
  text3: "#2a3a50",
  green: "#00e676",
  red: "#ff1744",
  orange: "#ffe600",
  blue: "#1a1aff",
};
const BASE_BOYCOTT = [
  {
    id: 1,
    name: "Z Energy",
    logo: "Z",
    bg: "#FF3B30",
    bl: 95,
    hike: "+28c",
    reason:
      "Raised prices 3× citing 'global tensions' — fuel already in NZ tanks",
    votes: 14823,
  },
  {
    id: 2,
    name: "BP",
    logo: "BP",
    bg: "#00A651",
    bl: 87,
    hike: "+24c",
    reason: "Profit margins up 340% while claiming supply disruption",
    votes: 11205,
  },
  {
    id: 3,
    name: "Mobil",
    logo: "M",
    bg: "#E30613",
    bl: 72,
    hike: "+19c",
    reason: "Pre-loaded NZ stock but charging Iran crisis rates",
    votes: 8341,
  },
  {
    id: 4,
    name: "Gull",
    logo: "G",
    bg: "#f5d000",
    bl: 18,
    hike: "+4c",
    reason: "Minor increase, relatively transparent pricing",
    votes: 1204,
  },
  {
    id: 5,
    name: "Allied",
    logo: "A",
    bg: "#4fc3f7",
    bl: 22,
    hike: "+5c",
    reason: "Small hike, locally owned — better accountability",
    votes: 987,
  },
  {
    id: 6,
    name: "NPD",
    logo: "N",
    bg: "#b388ff",
    bl: 15,
    hike: "+3c",
    reason: "Consistently competitive, independent NZ operator",
    votes: 643,
  },
];

const FACTS = [
  "NZ petrol takes 6–8 weeks to ship. Fuel here now was purchased before any conflict.",
  "Oil companies post record profits every quarter while blaming global events.",
  "NZ has no strategic petroleum reserve — making us vulnerable to corporate pricing.",
  "Z Energy's parent Ampol posted $1.4B profit last year.",
  "The Commerce Commission found fuel companies overcharge NZers by ~$400M/year.",
];

const SCENARIOS = [
  {
    id: "escalate",
    label: "War escalates",
    icon: "🔥",
    delta: +18,
    desc: "Strait of Hormuz disrupted",
  },
  {
    id: "ceasefire",
    label: "Ceasefire",
    icon: "🕊️",
    delta: -12,
    desc: "Negotiations succeed",
  },
  {
    id: "spike",
    label: "Supply shock",
    icon: "💥",
    delta: +31,
    desc: "Major pipeline attacked",
  },
  {
    id: "opec",
    label: "OPEC cuts",
    icon: "🛢️",
    delta: +9,
    desc: "Production reduced 15%",
  },
];

const FUEL_TYPES = ["91", "95", "Diesel"];

const NZ_STATIONS = [
  // Auckland
  {
    id: "ak1",
    name: "Z Energy Auckland CBD",
    brand: "Z Energy",
    suburb: "Auckland CBD",
    address: "1 Queen St, Auckland CBD",
    lat: -36.8485,
    lng: 174.7633,
  },
  {
    id: "ak2",
    name: "BP Newmarket",
    brand: "BP",
    suburb: "Newmarket",
    address: "45 Broadway, Newmarket",
    lat: -36.87,
    lng: 174.776,
  },
  {
    id: "ak3",
    name: "Gull Manukau",
    brand: "Gull",
    suburb: "Manukau",
    address: "12 Cavendish Dr, Manukau",
    lat: -36.9939,
    lng: 174.8804,
  },
  {
    id: "ak4",
    name: "NPD Henderson",
    brand: "NPD",
    suburb: "Henderson",
    address: "99 Lincoln Rd, Henderson",
    lat: -36.876,
    lng: 174.629,
  },
  {
    id: "ak5",
    name: "Mobil Takapuna",
    brand: "Mobil",
    suburb: "Takapuna",
    address: "50 Hurstmere Rd, Takapuna",
    lat: -36.7882,
    lng: 174.771,
  },
  {
    id: "ak6",
    name: "Allied Ponsonby",
    brand: "Allied",
    suburb: "Ponsonby",
    address: "210 Ponsonby Rd, Ponsonby",
    lat: -36.857,
    lng: 174.744,
  },
  {
    id: "ak7",
    name: "Z Energy Parnell",
    brand: "Z Energy",
    suburb: "Parnell",
    address: "200 Parnell Rd, Parnell",
    lat: -36.859,
    lng: 174.78,
  },
  {
    id: "ak8",
    name: "BP Remuera",
    brand: "BP",
    suburb: "Remuera",
    address: "388 Remuera Rd, Remuera",
    lat: -36.88,
    lng: 174.79,
  },
  {
    id: "ak9",
    name: "Gull Otahuhu",
    brand: "Gull",
    suburb: "Otahuhu",
    address: "8 Atkinson Ave, Otahuhu",
    lat: -36.95,
    lng: 174.84,
  },
  {
    id: "ak10",
    name: "Mobil Mt Eden",
    brand: "Mobil",
    suburb: "Mt Eden",
    address: "100 Mt Eden Rd, Mt Eden",
    lat: -36.88,
    lng: 174.76,
  },
  {
    id: "ak11",
    name: "Z Energy Penrose",
    brand: "Z Energy",
    suburb: "Penrose",
    address: "45 Station Rd, Penrose",
    lat: -36.91,
    lng: 174.81,
  },
  {
    id: "ak12",
    name: "NPD Albany",
    brand: "NPD",
    suburb: "Albany",
    address: "219 Don McKinnon Dr, Albany",
    lat: -36.73,
    lng: 174.7,
  },
  {
    id: "ak13",
    name: "BP East Tamaki",
    brand: "BP",
    suburb: "East Tamaki",
    address: "10 Harris Rd, East Tamaki",
    lat: -36.95,
    lng: 174.91,
  },
  {
    id: "ak14",
    name: "Gull Papakura",
    brand: "Gull",
    suburb: "Papakura",
    address: "8 Wood St, Papakura",
    lat: -37.06,
    lng: 174.94,
  },
  {
    id: "ak15",
    name: "Z Energy Botany",
    brand: "Z Energy",
    suburb: "Botany",
    address: "10 Botany Rd, Botany Downs",
    lat: -36.93,
    lng: 174.91,
  },
  // Papamoa / Tauranga
  {
    id: "pp1",
    name: "Gull Papamoa",
    brand: "Gull",
    suburb: "Papamoa",
    address: "230 Parton Rd, Papamoa",
    lat: -37.7132,
    lng: 176.3101,
  },
  {
    id: "pp2",
    name: "NPD Papamoa",
    brand: "NPD",
    suburb: "Papamoa",
    address: "7 Gravatt Rd, Papamoa Beach",
    lat: -37.7006,
    lng: 176.2839,
  },
  {
    id: "pp3",
    name: "Z Energy Papamoa",
    brand: "Z Energy",
    suburb: "Papamoa",
    address: "16 Domain Rd, Papamoa Beach",
    lat: -36.6991,
    lng: 176.2844,
  },
  {
    id: "pp4",
    name: "BP Papamoa",
    brand: "BP",
    suburb: "Papamoa",
    address: "48 Bruce Rd, Papamoa Beach",
    lat: -37.7011,
    lng: 176.2626,
  },
  {
    id: "pp5",
    name: "Waitomo Papamoa",
    brand: "Waitomo",
    suburb: "Papamoa",
    address: "72 Te Puke Hwy, Papamoa",
    lat: -37.7211,
    lng: 176.2841,
  },
  {
    id: "pp6",
    name: "PAK'nSAVE Fuel Papamoa",
    brand: "PAK'nSAVE",
    suburb: "Papamoa",
    address: "Gravatt Rd, Papamoa Beach",
    lat: -37.7011,
    lng: 176.2831,
  },
  {
    id: "ta1",
    name: "Z Energy Tauranga CBD",
    brand: "Z Energy",
    suburb: "Tauranga",
    address: "10 Cameron Rd, Tauranga",
    lat: -37.687,
    lng: 176.166,
  },
  {
    id: "ta2",
    name: "BP Tauranga",
    brand: "BP",
    suburb: "Tauranga",
    address: "110 Devonport Rd, Tauranga",
    lat: -37.688,
    lng: 176.17,
  },
  {
    id: "ta3",
    name: "Waitomo Mt Maunganui",
    brand: "Waitomo",
    suburb: "Mt Maunganui",
    address: "94 Hewletts Rd, Mt Maunganui",
    lat: -37.6655,
    lng: 176.1991,
  },
  {
    id: "ta4",
    name: "Gull Mt Maunganui",
    brand: "Gull",
    suburb: "Mt Maunganui",
    address: "122 Hewletts Rd, Mt Maunganui",
    lat: -37.6651,
    lng: 176.1938,
  },
  {
    id: "ta5",
    name: "Mobil Tauranga",
    brand: "Mobil",
    suburb: "Tauranga",
    address: "80 Wharf St, Tauranga",
    lat: -37.69,
    lng: 176.165,
  },
  // Wellington
  {
    id: "wl1",
    name: "Z Energy Wellington CBD",
    brand: "Z Energy",
    suburb: "Wellington CBD",
    address: "10 Lambton Quay, Wellington",
    lat: -41.2784,
    lng: 174.7767,
  },
  {
    id: "wl2",
    name: "BP Petone",
    brand: "BP",
    suburb: "Petone",
    address: "88 Jackson St, Petone",
    lat: -41.2271,
    lng: 174.8677,
  },
  {
    id: "wl3",
    name: "Gull Porirua",
    brand: "Gull",
    suburb: "Porirua",
    address: "15 Cobham Ct, Porirua",
    lat: -41.1339,
    lng: 174.844,
  },
  {
    id: "wl4",
    name: "NPD Johnsonville",
    brand: "NPD",
    suburb: "Johnsonville",
    address: "10 Moorefield Rd, Johnsonville",
    lat: -41.22,
    lng: 174.8,
  },
  {
    id: "wl5",
    name: "Z Energy Newtown",
    brand: "Z Energy",
    suburb: "Newtown",
    address: "100 Riddiford St, Newtown",
    lat: -41.3,
    lng: 174.78,
  },
  {
    id: "wl6",
    name: "Mobil Kilbirnie",
    brand: "Mobil",
    suburb: "Kilbirnie",
    address: "50 Onepu Rd, Kilbirnie",
    lat: -41.31,
    lng: 174.8,
  },
  {
    id: "wl7",
    name: "BP Lower Hutt",
    brand: "BP",
    suburb: "Lower Hutt",
    address: "149 High St, Lower Hutt",
    lat: -41.21,
    lng: 174.89,
  },
  {
    id: "wl8",
    name: "Z Energy Upper Hutt",
    brand: "Z Energy",
    suburb: "Upper Hutt",
    address: "180 Main St, Upper Hutt",
    lat: -41.12,
    lng: 175.07,
  },
  // Christchurch
  {
    id: "ch1",
    name: "Z Energy Christchurch CBD",
    brand: "Z Energy",
    suburb: "Christchurch",
    address: "100 Moorhouse Ave, Christchurch",
    lat: -43.54,
    lng: 172.64,
  },
  {
    id: "ch2",
    name: "BP Riccarton",
    brand: "BP",
    suburb: "Riccarton",
    address: "50 Riccarton Rd, Riccarton",
    lat: -43.5317,
    lng: 172.5986,
  },
  {
    id: "ch3",
    name: "Gull Hornby",
    brand: "Gull",
    suburb: "Hornby",
    address: "72 Main South Rd, Hornby",
    lat: -43.5524,
    lng: 172.5194,
  },
  {
    id: "ch4",
    name: "NPD Papanui",
    brand: "NPD",
    suburb: "Papanui",
    address: "380 Papanui Rd, Papanui",
    lat: -43.5,
    lng: 172.62,
  },
  {
    id: "ch5",
    name: "Mobil Sydenham",
    brand: "Mobil",
    suburb: "Sydenham",
    address: "77 Wordsworth St, Sydenham",
    lat: -43.55,
    lng: 172.63,
  },
  {
    id: "ch6",
    name: "Z Energy Burnside",
    brand: "Z Energy",
    suburb: "Burnside",
    address: "380 Harewood Rd, Burnside",
    lat: -43.5,
    lng: 172.57,
  },
  {
    id: "ch7",
    name: "BP Rangiora",
    brand: "BP",
    suburb: "Rangiora",
    address: "100 High St, Rangiora",
    lat: -43.31,
    lng: 172.59,
  },
  {
    id: "ch8",
    name: "Gull Rolleston",
    brand: "Gull",
    suburb: "Rolleston",
    address: "10 Rolleston Dr, Rolleston",
    lat: -43.59,
    lng: 172.38,
  },
  // Dunedin
  {
    id: "dn1",
    name: "Z Energy Dunedin CBD",
    brand: "Z Energy",
    suburb: "Dunedin",
    address: "55 Cumberland St, Dunedin",
    lat: -45.8788,
    lng: 170.5028,
  },
  {
    id: "dn2",
    name: "Gull Dunedin",
    brand: "Gull",
    suburb: "Dunedin",
    address: "380 Cumberland St, Dunedin",
    lat: -45.865,
    lng: 170.51,
  },
  {
    id: "dn3",
    name: "BP South Dunedin",
    brand: "BP",
    suburb: "South Dunedin",
    address: "221 King Edward St, S Dunedin",
    lat: -45.89,
    lng: 170.49,
  },
  {
    id: "dn4",
    name: "Mobil Dunedin",
    brand: "Mobil",
    suburb: "Dunedin",
    address: "10 Andersons Bay Rd, Dunedin",
    lat: -45.87,
    lng: 170.52,
  },
  // Hamilton
  {
    id: "hm1",
    name: "Z Energy Hamilton",
    brand: "Z Energy",
    suburb: "Hamilton",
    address: "25 Anglesea St, Hamilton",
    lat: -37.787,
    lng: 175.2793,
  },
  {
    id: "hm2",
    name: "NPD Hamilton",
    brand: "NPD",
    suburb: "Hamilton",
    address: "180 Tristram St, Hamilton",
    lat: -37.792,
    lng: 175.281,
  },
  {
    id: "hm3",
    name: "BP Hamilton",
    brand: "BP",
    suburb: "Hamilton",
    address: "50 Victoria St, Hamilton",
    lat: -37.785,
    lng: 175.28,
  },
  {
    id: "hm4",
    name: "Gull Hamilton",
    brand: "Gull",
    suburb: "Hamilton",
    address: "8 Greenwood St, Frankton",
    lat: -37.8,
    lng: 175.26,
  },
  // Palmerston North
  {
    id: "pn1",
    name: "Z Energy Palmerston North",
    brand: "Z Energy",
    suburb: "Palmerston North",
    address: "1 Main St, Palmerston North",
    lat: -40.3523,
    lng: 175.6082,
  },
  {
    id: "pn2",
    name: "BP Palmerston North",
    brand: "BP",
    suburb: "Palmerston North",
    address: "50 Fitzherbert Ave, Palmerston North",
    lat: -40.36,
    lng: 175.61,
  },
  {
    id: "pn3",
    name: "Gull Palmerston North",
    brand: "Gull",
    suburb: "Palmerston North",
    address: "800 Main St, Palmerston North",
    lat: -40.37,
    lng: 175.6,
  },
  // Napier / Hastings
  {
    id: "nb1",
    name: "Z Energy Napier",
    brand: "Z Energy",
    suburb: "Napier",
    address: "50 Hastings St, Napier",
    lat: -39.4928,
    lng: 176.912,
  },
  {
    id: "nb2",
    name: "BP Hastings",
    brand: "BP",
    suburb: "Hastings",
    address: "100 Heretaunga St, Hastings",
    lat: -39.638,
    lng: 176.849,
  },
  {
    id: "nb3",
    name: "Gull Napier",
    brand: "Gull",
    suburb: "Napier",
    address: "8 Vigor Brown St, Napier",
    lat: -39.5,
    lng: 176.9,
  },
  // Nelson
  {
    id: "nl1",
    name: "Z Energy Nelson",
    brand: "Z Energy",
    suburb: "Nelson",
    address: "100 Bridge St, Nelson",
    lat: -41.2706,
    lng: 173.284,
  },
  {
    id: "nl2",
    name: "BP Nelson",
    brand: "BP",
    suburb: "Nelson",
    address: "18 Waimea Rd, Nelson",
    lat: -41.28,
    lng: 173.28,
  },
  // New Plymouth
  {
    id: "np1",
    name: "Z Energy New Plymouth",
    brand: "Z Energy",
    suburb: "New Plymouth",
    address: "1 Liardet St, New Plymouth",
    lat: -39.0556,
    lng: 174.0752,
  },
  {
    id: "np2",
    name: "Gull New Plymouth",
    brand: "Gull",
    suburb: "New Plymouth",
    address: "22 Eliot St, New Plymouth",
    lat: -39.06,
    lng: 174.07,
  },
  // Whangarei
  {
    id: "wg1",
    name: "Z Energy Whangarei",
    brand: "Z Energy",
    suburb: "Whangarei",
    address: "1 Bank St, Whangarei",
    lat: -35.7275,
    lng: 174.324,
  },
  {
    id: "wg2",
    name: "BP Whangarei",
    brand: "BP",
    suburb: "Whangarei",
    address: "50 Okara Dr, Whangarei",
    lat: -35.73,
    lng: 174.32,
  },
  {
    id: "wg3",
    name: "Gull Whangarei",
    brand: "Gull",
    suburb: "Whangarei",
    address: "6 Porowini Ave, Whangarei",
    lat: -35.725,
    lng: 174.325,
  },
  // Rotorua
  {
    id: "rt1",
    name: "Z Energy Rotorua",
    brand: "Z Energy",
    suburb: "Rotorua",
    address: "1 Amohia St, Rotorua",
    lat: -38.1368,
    lng: 176.2497,
  },
  {
    id: "rt2",
    name: "BP Rotorua",
    brand: "BP",
    suburb: "Rotorua",
    address: "CNFENTON & LAKE RD, Rotorua",
    lat: -38.14,
    lng: 176.25,
  },
  {
    id: "rt3",
    name: "Gull Rotorua",
    brand: "Gull",
    suburb: "Rotorua",
    address: "1100 Fenton St, Rotorua",
    lat: -38.15,
    lng: 176.24,
  },
  // Waikato / Cambridge
  {
    id: "wk1",
    name: "Z Energy Cambridge",
    brand: "Z Energy",
    suburb: "Cambridge",
    address: "1 Victoria St, Cambridge",
    lat: -37.8893,
    lng: 175.4737,
  },
  {
    id: "wk2",
    name: "BP Cambridge",
    brand: "BP",
    suburb: "Cambridge",
    address: "50 Queen St, Cambridge",
    lat: -37.89,
    lng: 175.47,
  },
  // Invercargill
  {
    id: "ic1",
    name: "Z Energy Invercargill",
    brand: "Z Energy",
    suburb: "Invercargill",
    address: "1 Dee St, Invercargill",
    lat: -46.4132,
    lng: 168.3538,
  },
  {
    id: "ic2",
    name: "Gull Invercargill",
    brand: "Gull",
    suburb: "Invercargill",
    address: "100 Tay St, Invercargill",
    lat: -46.41,
    lng: 168.36,
  },
  // Queenstown
  {
    id: "qt1",
    name: "Z Energy Queenstown",
    brand: "Z Energy",
    suburb: "Queenstown",
    address: "1 Camp St, Queenstown",
    lat: -45.0312,
    lng: 168.6626,
  },
  {
    id: "qt2",
    name: "BP Queenstown",
    brand: "BP",
    suburb: "Queenstown",
    address: "Stanley St, Queenstown",
    lat: -45.03,
    lng: 168.66,
  },
  // Gisborne
  {
    id: "gs1",
    name: "Z Energy Gisborne",
    brand: "Z Energy",
    suburb: "Gisborne",
    address: "60 Gladstone Rd, Gisborne",
    lat: -38.6623,
    lng: 178.0176,
  },
  // Whanganui
  {
    id: "wn1",
    name: "Z Energy Whanganui",
    brand: "Z Energy",
    suburb: "Whanganui",
    address: "1 Victoria Ave, Whanganui",
    lat: -39.9301,
    lng: 175.0536,
  },
];

function NozlLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Circle background */}
      <circle cx="50" cy="50" r="50" fill="#0077cc" />

      {/* Shield behind N */}
      <path
        d="M50 14 L80 26 L80 54 Q80 76 50 88 Q20 76 20 54 L20 26 Z"
        fill="#ffffff"
        opacity="0.15"
      />
      {/* Shield border */}
      <path
        d="M50 14 L80 26 L80 54 Q80 76 50 88 Q20 76 20 54 L20 26 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Bold N — white, centred over shield */}
      <line
        x1="28"
        y1="70"
        x2="28"
        y2="30"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <line
        x1="28"
        y1="30"
        x2="72"
        y2="70"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="70"
        x2="72"
        y2="30"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
async function groqCall(prompt) {
  try {
    const res = await fetch("/api/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const d = await res.json();
    return d.choices?.[0]?.message?.content || "";
  } catch (e) {
    console.log("Groq error:", e);
    return "";
  }
}
function SparkLine({ data, color, height = 52 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const w = c.offsetWidth || 300;
    c.width = w * 2;
    c.height = height * 2;
    const ctx = c.getContext("2d");
    ctx.scale(2, 2);
    const mn = Math.min(...data),
      mx = Math.max(...data),
      rng = mx - mn || 1;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: height - 4 - ((v - mn) / rng) * (height - 10),
    }));
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, color + "55");
    g.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, height);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(w, height);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    const lp = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(lp.x, lp.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  return (
    <canvas ref={ref} style={{ display: "block", width: "100%", height }} />
  );
}

export default function App() {
  const [tab, setTab] = useState("prices");
  const [fuelType, setFuelType] = useState("91");
  const [oil, setOil] = useState(87.4);
  const [oilChg, setOilChg] = useState(0);
  const [oilHist, setOilHist] = useState(() =>
    Array.from({ length: 40 }, () => 87.4 + (Math.random() - 0.5) * 5)
  );
  const [nzPrice, setNzPrice] = useState(2.891);
  const [factIdx, setFactIdx] = useState(0);
  const [voted, setVoted] = useState({});
  const [boycottStations, setBoycottStations] = useState(BASE_BOYCOTT);
  const [activeSc, setActiveSc] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecasting, setForecasting] = useState(false);
  const [forecastErr, setForecastErr] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [appData, setAppData] = useState(loadData);
  const [shareModal, setShareModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [locAsked, setLocAsked] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addStation, setAddStation] = useState(null);
  const [add91, setAdd91] = useState("");
  const [add95, setAdd95] = useState("");
  const [addDsl, setAddDsl] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [addCustom, setAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customBrand, setCustomBrand] = useState("Other");
  const [customSuburb, setCustomSuburb] = useState("");
  const [aiPrices, setAiPrices] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);

  const calcNZ = (o) =>
    parseFloat(((o / 159) * 1.67 * 100 + 85) / 100).toFixed(3);
  const totalVotes = () => boycottStations.reduce((a, b) => a + b.votes, 0);
  const fmtK = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString());
  const oilColor = oilChg > 0.08 ? C.red : oilChg < -0.08 ? C.green : C.accent;
  const oilArrow = oilChg >= 0 ? "▲" : "▼";

  const FINNHUB_KEY = "d6t5uepr01qoqoiscf3gd6t5uepr01qoqoiscf40";

  useEffect(() => {
    const fetchOil = async () => {
      try {
        const res = await fetch("/api/oil");
        const d = await res.json();
        if (d.price && d.price > 0) {
          setOil((prev) => {
            const next = parseFloat(d.price.toFixed(2));
            const diff = parseFloat((next - prev).toFixed(2));
            setOilChg(diff);
            setOilHist((h) => [...h.slice(-49), next]);
            setNzPrice(parseFloat(calcNZ(next)));
            return next;
          });
        }
      } catch (e) {
        console.log("Oil fetch error:", e);
      }
    };
    fetchOil();
    const t = setInterval(fetchOil, 60000);
    return () => clearInterval(t);
  }, []);
  const loadAiPrices = async () => {
    setAiLoading(true);
    try {
      const text = await groqCall(
        `You are a NZ fuel price expert. Today's date: ${new Date().toLocaleDateString(
          "en-NZ"
        )}. Current Brent Crude oil: ~$87/bbl. NZD/USD: ~0.60.

Provide realistic estimated current NZ pump prices for these stations. Independent brands (Gull, NPD, Waitomo, Allied, PAK'nSAVE) should be 8-15c cheaper than major brands (Z Energy, BP, Mobil).

Return ONLY a JSON object, no markdown, where keys are station IDs and values have price91, price95, diesel:
{"ak1":{"price91":2.47,"price95":2.61,"diesel":2.31},"ak2":{"price91":2.45,"price95":2.59,"diesel":2.29},"ak3":{"price91":2.31,"price95":2.45,"diesel":2.19},"ak4":{"price91":2.29,"price95":2.43,"diesel":2.17},"ak5":{"price91":2.46,"price95":2.60,"diesel":2.30},"ak6":{"price91":2.44,"price95":2.58,"diesel":2.28},"ak7":{"price91":2.47,"price95":2.61,"diesel":2.31},"ak8":{"price91":2.45,"price95":2.59,"diesel":2.29},"ak9":{"price91":2.30,"price95":2.44,"diesel":2.18},"ak10":{"price91":2.46,"price95":2.60,"diesel":2.30},"ak11":{"price91":2.47,"price95":2.61,"diesel":2.31},"ak12":{"price91":2.28,"price95":2.42,"diesel":2.16},"ak13":{"price91":2.45,"price95":2.59,"diesel":2.29},"ak14":{"price91":2.29,"price95":2.43,"diesel":2.17},"ak15":{"price91":2.47,"price95":2.61,"diesel":2.31},"pp1":{"price91":2.19,"price95":2.33,"diesel":2.09},"pp2":{"price91":2.21,"price95":2.35,"diesel":2.11},"pp3":{"price91":2.47,"price95":2.61,"diesel":2.31},"pp4":{"price91":2.45,"price95":2.59,"diesel":2.29},"pp5":{"price91":2.22,"price95":2.36,"diesel":2.12},"pp6":{"price91":2.18,"price95":2.32,"diesel":2.08},"ta1":{"price91":2.47,"price95":2.61,"diesel":2.31},"ta2":{"price91":2.45,"price95":2.59,"diesel":2.29},"ta3":{"price91":2.22,"price95":2.36,"diesel":2.12},"ta4":{"price91":2.20,"price95":2.34,"diesel":2.10},"ta5":{"price91":2.46,"price95":2.60,"diesel":2.30},"wl1":{"price91":2.49,"price95":2.63,"diesel":2.33},"wl2":{"price91":2.46,"price95":2.60,"diesel":2.30},"wl3":{"price91":2.31,"price95":2.45,"diesel":2.19},"wl4":{"price91":2.28,"price95":2.42,"diesel":2.16},"wl5":{"price91":2.48,"price95":2.62,"diesel":2.32},"wl6":{"price91":2.47,"price95":2.61,"diesel":2.31},"wl7":{"price91":2.45,"price95":2.59,"diesel":2.29},"wl8":{"price91":2.46,"price95":2.60,"diesel":2.30},"ch1":{"price91":2.44,"price95":2.58,"diesel":2.28},"ch2":{"price91":2.43,"price95":2.57,"diesel":2.27},"ch3":{"price91":2.29,"price95":2.43,"diesel":2.17},"ch4":{"price91":2.27,"price95":2.41,"diesel":2.15},"ch5":{"price91":2.44,"price95":2.58,"diesel":2.28},"ch6":{"price91":2.44,"price95":2.58,"diesel":2.28},"ch7":{"price91":2.43,"price95":2.57,"diesel":2.27},"ch8":{"price91":2.28,"price95":2.42,"diesel":2.16},"dn1":{"price91":2.46,"price95":2.60,"diesel":2.30},"dn2":{"price91":2.31,"price95":2.45,"diesel":2.19},"dn3":{"price91":2.45,"price95":2.59,"diesel":2.29},"dn4":{"price91":2.46,"price95":2.60,"diesel":2.30},"hm1":{"price91":2.46,"price95":2.60,"diesel":2.30},"hm2":{"price91":2.27,"price95":2.41,"diesel":2.15},"hm3":{"price91":2.45,"price95":2.59,"diesel":2.29},"hm4":{"price91":2.28,"price95":2.42,"diesel":2.16},"pn1":{"price91":2.47,"price95":2.61,"diesel":2.31},"pn2":{"price91":2.46,"price95":2.60,"diesel":2.30},"pn3":{"price91":2.30,"price95":2.44,"diesel":2.18},"nb1":{"price91":2.47,"price95":2.61,"diesel":2.31},"nb2":{"price91":2.46,"price95":2.60,"diesel":2.30},"nb3":{"price91":2.31,"price95":2.45,"diesel":2.19},"nl1":{"price91":2.48,"price95":2.62,"diesel":2.32},"nl2":{"price91":2.47,"price95":2.61,"diesel":2.31},"np1":{"price91":2.48,"price95":2.62,"diesel":2.32},"np2":{"price91":2.32,"price95":2.46,"diesel":2.20},"wg1":{"price91":2.49,"price95":2.63,"diesel":2.33},"wg2":{"price91":2.48,"price95":2.62,"diesel":2.32},"wg3":{"price91":2.33,"price95":2.47,"diesel":2.21},"rt1":{"price91":2.49,"price95":2.63,"diesel":2.33},"rt2":{"price91":2.48,"price95":2.62,"diesel":2.32},"rt3":{"price91":2.33,"price95":2.47,"diesel":2.21},"wk1":{"price91":2.46,"price95":2.60,"diesel":2.30},"wk2":{"price91":2.45,"price95":2.59,"diesel":2.29},"ic1":{"price91":2.50,"price95":2.64,"diesel":2.34},"ic2":{"price91":2.34,"price95":2.48,"diesel":2.22},"qt1":{"price91":2.55,"price95":2.69,"diesel":2.39},"qt2":{"price91":2.54,"price95":2.68,"diesel":2.38},"gs1":{"price91":2.51,"price95":2.65,"diesel":2.35},"wn1":{"price91":2.48,"price95":2.62,"diesel":2.32}}

Adjust prices slightly from the examples to reflect realistic current market conditions. Return the same JSON structure.`
      );
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiPrices(parsed);
      setAiLoaded(true);
    } catch (e) {
      console.log("AI price load error:", e);
    } finally {
      setAiLoading(false);
    }
  };

  const askLocation = () => {
    setLocAsked(true);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      () => {}
    );
  };

  const getDistKm = (lat, lng) => {
    if (!userLat || !userLng) return null;
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLng = ((lng - userLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return parseFloat(
      (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
    );
  };

  const getPriceForType = (p, type) => {
    if (!p) return null;
    if (type === "95") return p.price95;
    if (type === "Diesel") return p.diesel;
    return p.price91;
  };

  const getEffectivePrice = (stationId, type) => {
    const community = appData.prices[stationId];
    if (community)
      return {
        price: getPriceForType(community, type),
        source: "community",
        time: community.time,
      };
    const ai = aiPrices[stationId];
    if (ai)
      return { price: getPriceForType(ai, type), source: "ai", time: null };
    return null;
  };

  const saveReport = (stationId, data) => {
    const updated = {
      ...appData,
      prices: { ...appData.prices, [stationId]: data },
    };
    setAppData(updated);
    saveData(updated);
  };

  const saveCustomStation = () => {
    if (!customName || !customAddress) return;
    const newStation = {
      id: "custom_" + Date.now(),
      name: customName,
      brand: customBrand,
      suburb: customSuburb,
      address: customAddress,
      lat: userLat || -36.8485,
      lng: userLng || 174.7633,
      custom: true,
    };
    const updated = {
      ...appData,
      custom: [...(appData.custom || []), newStation],
    };
    setAppData(updated);
    saveData(updated);
    setAddCustom(false);
    setCustomName("");
    setCustomAddress("");
    setCustomBrand("Other");
    setCustomSuburb("");
    setAddStation(newStation);
  };

  const submitAddPrice = () => {
    if (!addStation || (!add91 && !add95 && !addDsl)) return;
    saveReport(addStation.id, {
      price91: add91 ? parseFloat(add91) : null,
      price95: add95 ? parseFloat(add95) : null,
      diesel: addDsl ? parseFloat(addDsl) : null,
      reporter: "community",
      time: Date.now(),
    });
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setAddStation(null);
      setAdd91("");
      setAdd95("");
      setAddDsl("");
    }, 2000);
  };

  const doBoycott = (id) => {
    if (voted[id]) return;
    setVoted((v) => ({ ...v, [id]: true }));
    setBoycottStations((s) =>
      s.map((st) => (st.id === id ? { ...st, votes: st.votes + 1 } : st))
    );
  };

  const runForecast = async (sc) => {
    setActiveSc(sc.id);
    setForecasting(true);
    setForecast(null);
    setForecastErr(false);
    try {
      const proj = oil + sc.delta;
      const text = await groqCall(
        `NZ fuel analyst. Brent Crude: $${oil.toFixed(
          2
        )}/bbl. NZD/USD ~0.60. NZ pump avg: $${nzPrice}/L. Scenario: "${
          sc.label
        }" — ${sc.desc}. Oil moves ${sc.delta > 0 ? "+" : ""}${
          sc.delta
        } USD to ~$${proj.toFixed(
          2
        )}/bbl. NZ fuel already in storage was purchased 6-8 weeks ago so any immediate hike = pure corporate profit. Return ONLY raw JSON no markdown: {"nzPriceChange":"+Xc or -Xc","newPumpPrice":"$X.XX/L","timeframe":"when NZ feels this","corporateExcuse":"excuse they use","fairIncrease":"what is fair","gougeAmount":"extra profit/litre","verdict":"GOUGE or JUSTIFIED or MIXED","verdictReason":"one sentence","driverTip":"best action now"}`
      );
      setForecast(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      console.log("Forecast error:", e);
      setForecastErr(true);
    } finally {
      setForecasting(false);
    }
  };

  const timeAgo = (ts) => {
    if (!ts) return "";
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const brandColor = (brand) => {
    const m = {
      "Z Energy": "#FF3B30",
      BP: "#00A651",
      Mobil: "#E30613",
      Gull: C.accent,
      Allied: C.blue,
      NPD: "#b388ff",
      Waitomo: C.orange,
      "PAK'nSAVE": C.accent,
    };
    return m[brand] || "#8892b0";
  };

  const allStations = [...NZ_STATIONS, ...(appData.custom || [])];

  const filtered = allStations.filter(
    (s) =>
      searchText === "" ||
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.suburb.toLowerCase().includes(searchText.toLowerCase()) ||
      s.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      s.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const enriched = filtered.map((s) => ({
    ...s,
    dist: getDistKm(s.lat, s.lng),
    community: appData.prices[s.id] || null,
    effective: getEffectivePrice(s.id, fuelType),
  }));

  const sortedStations = [...enriched].sort((a, b) => {
    if (userLat) return (a.dist || 999) - (b.dist || 999);
    const pa = a.effective?.price || 999;
    const pb = b.effective?.price || 999;
    return pa - pb;
  });

  const withPrices = sortedStations.filter((s) => s.effective);
  const cheapest = withPrices[0];
  const cheapestPrice = cheapest?.effective?.price;
  const mostExpensive =
    withPrices.length > 1 ? withPrices[withPrices.length - 1] : null;

  const addFiltered = allStations.filter(
    (s) =>
      addSearch === "" ||
      s.name.toLowerCase().includes(addSearch.toLowerCase()) ||
      s.suburb.toLowerCase().includes(addSearch.toLowerCase()) ||
      s.brand.toLowerCase().includes(addSearch.toLowerCase()) ||
      s.address.toLowerCase().includes(addSearch.toLowerCase())
  );

  return (
    <div style={S.root}>
      {/* TICKER */}
      <div style={S.ticker}>
        <div style={S.tickerInner}>
          {[0, 1].map((i) => (
            <span key={i} style={S.tickerSeg}>
              Brent ${oil.toFixed(2)}/bbl {oilArrow}{" "}
              {Math.abs(oilChg).toFixed(2)} &nbsp;•&nbsp; NZ est. ${nzPrice}/L
              &nbsp;•&nbsp; {Object.keys(appData.prices).length} community
              prices &nbsp;•&nbsp; {allStations.length} stations &nbsp;•&nbsp;
              #Nozl &nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div style={S.screen}>
        {/* HEADER */}
        <div style={S.header}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <NozlLogo size={42} />
              <div>
                <div style={S.appTitle}>Nozl</div>
                <div style={S.subtitle}>NZ fuel prices · community powered</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              <div style={S.liveBadge}>
                <div style={S.liveDot} />
                <span style={S.liveLabel}>LIVE</span>
              </div>
              {aiLoading && (
                <div
                  style={{
                    fontSize: 10,
                    color: C.accent,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      ...S.liveDot,
                      background: C.accent,
                      animation: "pulse 0.6s ease-in-out infinite",
                    }}
                  />
                  Loading AI prices...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        {tab === "prices" && (
          <div style={{ padding: "0 16px 10px" }}>
            <div style={S.searchBar}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="4.5"
                  stroke={C.text2}
                  strokeWidth="1.5"
                />
                <line
                  x1="9.8"
                  y1="9.8"
                  x2="13"
                  y2="13"
                  stroke={C.text2}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                style={S.searchInput}
                placeholder="Search suburb, station or brand..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText ? (
                <span
                  style={{ fontSize: 16, cursor: "pointer", color: C.text2 }}
                  onClick={() => setSearchText("")}
                >
                  ✕
                </span>
              ) : (
                <button
                  style={{
                    fontSize: 11,
                    color: C.accent,
                    background: C.accent + "22",
                    border: `1px solid ${C.accent}44`,
                    borderRadius: 6,
                    padding: "3px 8px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                  onClick={askLocation}
                >
                  📍 {locAsked && userLat ? "Located ✓" : "Near me"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* FUEL PILLS */}
        {tab === "prices" && (
          <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
            {FUEL_TYPES.map((f) => (
              <button
                key={f}
                style={{
                  ...S.fuelPill,
                  ...(fuelType === f ? S.fuelPillOn : {}),
                }}
                onClick={() => setFuelType(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* NAV */}
        <div style={S.bottomNav}>
          {[
            { id: "prices", icon: "⛽", label: "Prices" },
            { id: "add", icon: "➕", label: "Add Price" },
            { id: "boycott", icon: "🚫", label: "Boycott" },
            { id: "forecast", icon: "🔮", label: "Forecast" },
          ].map((t) => (
            <button
              key={t.id}
              style={{ ...S.navBtn, ...(tab === t.id ? S.navBtnOn : {}) }}
              onClick={() => setTab(t.id)}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  fontWeight: tab === t.id ? 700 : 400,
                }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* ══ PRICES TAB ══ */}
        {tab === "prices" && (
          <div style={S.section}>
            {/* Live banner */}
            <div style={S.priceBanner}>
              <div>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 3 }}>
                  Live oil → NZ pump est.
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: C.accent,
                    letterSpacing: -0.5,
                    lineHeight: 1,
                  }}
                >
                  ${nzPrice}
                  <span
                    style={{ fontSize: 16, fontWeight: 500, color: C.text2 }}
                  >
                    /L
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: oilColor,
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {oilArrow} Brent ${oil.toFixed(2)}/bbl ·{" "}
                  {Math.abs(oilChg).toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <SparkLine data={oilHist} color={oilColor} height={52} />
              </div>
            </div>

            {/* Cheapest card */}
            {cheapest && cheapestPrice && (
              <div style={S.cheapestCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.green,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                    }}
                  >
                    🏆 Cheapest {fuelType}{" "}
                    {cheapest.effective?.source === "ai" ? "(AI est.)" : ""}
                  </div>
                  <div style={{ fontSize: 11, color: C.text2 }}>
                    {cheapest.effective?.source === "community"
                      ? timeAgo(cheapest.effective.time)
                      : cheapest.dist
                      ? `${cheapest.dist} km`
                      : ""}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 20, fontWeight: 800, color: C.text }}
                    >
                      {cheapest.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>
                      {cheapest.address}
                    </div>
                    {cheapest.dist && (
                      <div
                        style={{ fontSize: 12, color: C.green, marginTop: 3 }}
                      >
                        {cheapest.dist} km away
                      </div>
                    )}
                    {cheapest.effective?.source === "ai" && (
                      <div
                        style={{
                          marginTop: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: C.accent + "22",
                          border: `1px solid ${C.accent}44`,
                          borderRadius: 6,
                          padding: "3px 8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: C.accent,
                            fontWeight: 700,
                          }}
                        >
                          ⚡ AI ESTIMATE
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 42,
                        fontWeight: 900,
                        color: C.green,
                        letterSpacing: -1.5,
                        lineHeight: 1,
                      }}
                    >
                      ${cheapestPrice.toFixed(2)}
                    </div>
                    {mostExpensive && cheapestPrice && (
                      <div
                        style={{ fontSize: 11, color: C.green, marginTop: 2 }}
                      >
                        Save $
                        {(
                          (getPriceForType(
                            mostExpensive.effective?.source === "community"
                              ? mostExpensive.community
                              : aiPrices[mostExpensive.id],
                            fuelType
                          ) -
                            cheapestPrice) *
                          50
                        ).toFixed(2)}{" "}
                        per 50L
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI loading state */}
            {aiLoading && Object.keys(appData.prices).length === 0 && (
              <div
                style={{
                  background: C.card,
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 10,
                  border: `1px solid ${C.accent}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={S.spinner} />
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: C.accent }}
                  >
                    Loading AI price estimates...
                  </div>
                  <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>
                    Fetching current NZ market prices
                  </div>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {[
                {
                  val: Object.keys(appData.prices).length,
                  lbl: "Community prices",
                  color: C.green,
                },
                { val: allStations.length, lbl: "Stations", color: C.accent },
                { val: fmtK(totalVotes()), lbl: "Boycotting", color: C.red },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: C.card,
                    borderRadius: 10,
                    padding: "10px 8px",
                    border: `1px solid ${C.border}`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: s.color }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>

            {/* AI vs community legend */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 10,
                padding: "8px 12px",
                background: C.card,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.green,
                  }}
                />
                <span style={{ fontSize: 11, color: C.text2 }}>
                  Community reported
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.accent,
                  }}
                />
                <span style={{ fontSize: 11, color: C.text2 }}>
                  AI estimated
                </span>
              </div>
            </div>

            {/* Station list */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                {userLat ? "Nearest first" : "Best price first"} · {fuelType}
              </div>
              <div style={{ fontSize: 11, color: C.text2 }}>
                {filtered.length} stations
              </div>
            </div>

            {sortedStations.map((s) => {
              const eff = s.effective;
              const price = eff?.price;
              const isCommunity = eff?.source === "community";
              const isAI = eff?.source === "ai";
              const isCheapest = s.id === cheapest?.id && eff;
              const bc = brandColor(s.brand);
              const allP =
                s.community || (aiPrices[s.id] ? aiPrices[s.id] : null);

              return (
                <div
                  key={s.id}
                  style={{
                    background: C.card,
                    borderRadius: 12,
                    padding: "12px 14px",
                    marginBottom: 8,
                    border: `1px solid ${isCheapest ? C.green : C.border}`,
                    transition: "border .2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: bc,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: C.text,
                          }}
                        >
                          {s.name}
                        </span>
                        {isCheapest && (
                          <span
                            style={{
                              fontSize: 9,
                              background: C.green + "22",
                              color: C.green,
                              padding: "2px 6px",
                              borderRadius: 5,
                              fontWeight: 800,
                            }}
                          >
                            CHEAPEST
                          </span>
                        )}
                        {s.custom && (
                          <span
                            style={{
                              fontSize: 9,
                              background: C.blue + "22",
                              color: C.blue,
                              padding: "2px 6px",
                              borderRadius: 5,
                              fontWeight: 700,
                            }}
                          >
                            USER ADDED
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.text2,
                          marginBottom: 6,
                        }}
                      >
                        {s.address}
                        {s.dist != null && (
                          <span style={{ color: C.green, marginLeft: 6 }}>
                            · {s.dist} km
                          </span>
                        )}
                      </div>
                      {allP ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 5,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {[
                            ["91", allP.price91],
                            ["95", allP.price95],
                            ["DSL", allP.diesel],
                          ].map(([lbl, val]) =>
                            val ? (
                              <div
                                key={lbl}
                                style={{
                                  background: C.card2,
                                  borderRadius: 6,
                                  padding: "4px 7px",
                                  textAlign: "center",
                                  border: `1px solid ${C.border}`,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 9,
                                    color: C.text2,
                                    fontWeight: 600,
                                  }}
                                >
                                  {lbl}
                                </div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: isCommunity ? C.text : C.accent,
                                  }}
                                >
                                  ${val.toFixed(2)}
                                </div>
                              </div>
                            ) : null
                          )}
                          {isCommunity && (
                            <span style={{ fontSize: 10, color: C.green }}>
                              {timeAgo(eff.time)}
                            </span>
                          )}
                          {isAI && (
                            <span
                              style={{
                                fontSize: 9,
                                background: C.accent + "22",
                                color: C.accent,
                                padding: "2px 7px",
                                borderRadius: 5,
                                fontWeight: 700,
                                border: `1px solid ${C.accent}33`,
                              }}
                            >
                              ⚡ AI EST.
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 12,
                            color: C.text3,
                            fontStyle: "italic",
                          }}
                        >
                          No price data
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                        flexShrink: 0,
                        marginLeft: 10,
                      }}
                    >
                      {price && (
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 900,
                            color: isCheapest
                              ? C.green
                              : isCommunity
                              ? C.text
                              : C.accent,
                            letterSpacing: -0.5,
                            lineHeight: 1,
                          }}
                        >
                          ${price.toFixed(2)}
                        </div>
                      )}
                      <button
                        style={{
                          background: isCommunity ? C.card2 : C.accent + "22",
                          color: isCommunity ? C.text2 : C.accent,
                          border: `1px solid ${
                            isCommunity ? C.border : C.accent + "44"
                          }`,
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        onClick={() => {
                          setAddStation(s);
                          setTab("add");
                          if (s.community) {
                            setAdd91(s.community.price91?.toString() || "");
                            setAdd95(s.community.price95?.toString() || "");
                            setAddDsl(s.community.diesel?.toString() || "");
                          }
                        }}
                      >
                        {isCommunity ? "✏️ Update" : "⛽ Report"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 14, color: C.text2, marginBottom: 12 }}>
                  No stations match "{searchText}"
                </div>
                <button
                  style={S.accentBtn}
                  onClick={() => {
                    setTab("add");
                    setAddCustom(true);
                  }}
                >
                  + Add this station
                </button>
              </div>
            )}

            <div
              style={{
                textAlign: "center",
                padding: "14px 0",
                fontSize: 11,
                color: C.text3,
              }}
            >
              ⚡ AI estimated · ● Community reported · Help by tapping Report
            </div>
          </div>
        )}

        {/* ══ ADD PRICE TAB ══ */}
        {tab === "add" && (
          <div style={S.section}>
            <div
              style={{
                background: `linear-gradient(135deg, #0e1a3a, ${C.bg})`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 16,
                border: `1px solid ${C.accent}33`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⛽</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.accent,
                  marginBottom: 6,
                }}
              >
                Just filled up?
              </div>
              <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.6 }}>
                Report what you paid and help thousands of Kiwis find cheap
                fuel.
              </div>
            </div>

            {!addStation && !addCustom ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div style={S.stepCircle}>1</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    Which station?
                  </div>
                </div>
                <div style={S.searchBar}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="4.5"
                      stroke={C.text2}
                      strokeWidth="1.5"
                    />
                    <line
                      x1="9.8"
                      y1="9.8"
                      x2="13"
                      y2="13"
                      stroke={C.text2}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    style={S.searchInput}
                    placeholder="Search station or suburb..."
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                  />
                  {addSearch && (
                    <span
                      style={{
                        fontSize: 16,
                        cursor: "pointer",
                        color: C.text2,
                      }}
                      onClick={() => setAddSearch("")}
                    >
                      ✕
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 10 }}>
                  {addFiltered.slice(0, 15).map((s) => {
                    const hasCommunity = !!appData.prices[s.id];
                    return (
                      <div
                        key={s.id}
                        style={{
                          background: C.card,
                          borderRadius: 10,
                          padding: "12px 14px",
                          marginBottom: 6,
                          border: `1px solid ${C.border}`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "border .15s",
                        }}
                        onClick={() => {
                          setAddStation(s);
                          setAddSearch("");
                          if (appData.prices[s.id]) {
                            const p = appData.prices[s.id];
                            setAdd91(p.price91?.toString() || "");
                            setAdd95(p.price95?.toString() || "");
                            setAddDsl(p.diesel?.toString() || "");
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: brandColor(s.brand),
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {s.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.text2 }}>
                            {s.address}
                          </div>
                        </div>
                        {hasCommunity && (
                          <span
                            style={{
                              fontSize: 9,
                              background: C.green + "22",
                              color: C.green,
                              padding: "2px 7px",
                              borderRadius: 5,
                              fontWeight: 700,
                            }}
                          >
                            ✓ Reported
                          </span>
                        )}
                        <svg
                          width="7"
                          height="12"
                          viewBox="0 0 7 12"
                          fill="none"
                        >
                          <path
                            d="M1 1l5 5-5 5"
                            stroke={C.text2}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 16px",
                    background: C.card,
                    borderRadius: 12,
                    border: `1px dashed ${C.border2}`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 13, color: C.text2, marginBottom: 10 }}
                  >
                    Station not listed?
                  </div>
                  <button
                    style={S.accentBtn}
                    onClick={() => setAddCustom(true)}
                  >
                    + Add new station
                  </button>
                </div>
              </div>
            ) : addCustom ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <div style={S.stepCircle}>1</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    Add a new station
                  </div>
                </div>
                {[
                  {
                    label: "Station name",
                    val: customName,
                    set: setCustomName,
                    placeholder: "e.g. Gull Papamoa East",
                  },
                  {
                    label: "Address",
                    val: customAddress,
                    set: setCustomAddress,
                    placeholder: "e.g. 123 Domain Rd, Papamoa",
                  },
                  {
                    label: "Suburb",
                    val: customSuburb,
                    set: setCustomSuburb,
                    placeholder: "e.g. Papamoa",
                  },
                ].map((f) => (
                  <div key={f.label} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.text2,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 6,
                      }}
                    >
                      {f.label}
                    </div>
                    <input
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        background: C.card2,
                        border: `1px solid ${C.border2}`,
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: 14,
                        color: C.text,
                        fontFamily: "inherit",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text2,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 6,
                    }}
                  >
                    Brand
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      "Z Energy",
                      "BP",
                      "Mobil",
                      "Gull",
                      "NPD",
                      "Allied",
                      "Waitomo",
                      "PAK'nSAVE",
                      "Other",
                    ].map((b) => (
                      <button
                        key={b}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: `1px solid ${
                            customBrand === b ? C.accent : C.border
                          }`,
                          background:
                            customBrand === b ? C.accent + "22" : C.card,
                          color: customBrand === b ? C.accent : C.text2,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        onClick={() => setCustomBrand(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{ ...S.accentBtn, flex: 1 }}
                    onClick={saveCustomStation}
                  >
                    Save station
                  </button>
                  <button
                    style={{
                      background: C.card,
                      color: C.text2,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onClick={() => setAddCustom(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div style={S.stepCircle}>2</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    Enter the prices you saw
                  </div>
                </div>
                <div
                  style={{
                    background: C.card,
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 14,
                    border: `1px solid ${C.accent}44`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: brandColor(addStation.brand),
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 14, fontWeight: 700, color: C.accent }}
                    >
                      {addStation.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.text2 }}>
                      {addStation.address}
                    </div>
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: C.text2,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onClick={() => {
                      setAddStation(null);
                      setAdd91("");
                      setAdd95("");
                      setAddDsl("");
                    }}
                  >
                    Change
                  </button>
                </div>

                {addSuccess ? (
                  <div
                    style={{
                      background: "#0a2010",
                      borderRadius: 14,
                      padding: "32px 20px",
                      textAlign: "center",
                      border: `1px solid ${C.green}`,
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: C.green,
                        marginBottom: 6,
                      }}
                    >
                      Price reported!
                    </div>
                    <div style={{ fontSize: 14, color: C.text2 }}>
                      Thanks for helping the Nozl community 🙌
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      {[
                        {
                          label: "91 Unleaded",
                          val: add91,
                          set: setAdd91,
                          hint: "2.19",
                        },
                        {
                          label: "95 Premium",
                          val: add95,
                          set: setAdd95,
                          hint: "2.33",
                        },
                        {
                          label: "Diesel",
                          val: addDsl,
                          set: setAddDsl,
                          hint: "2.11",
                        },
                      ].map((f) => (
                        <div key={f.label}>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.text2,
                              fontWeight: 700,
                              marginBottom: 6,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            {f.label}
                          </div>
                          <div
                            style={{
                              background: C.card2,
                              borderRadius: 10,
                              border: `1px solid ${
                                f.val ? C.accent : C.border
                              }`,
                              padding: "10px 8px",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              transition: "border .2s",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 15,
                                color: C.accent,
                                fontWeight: 800,
                              }}
                            >
                              $
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              max="5"
                              placeholder={f.hint}
                              value={f.val}
                              onChange={(e) => f.set(e.target.value)}
                              style={{
                                flex: 1,
                                background: "none",
                                border: "none",
                                outline: "none",
                                fontSize: 20,
                                fontWeight: 800,
                                color: C.text,
                                fontFamily: "inherit",
                                width: "100%",
                                minWidth: 0,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        background: C.card,
                        borderRadius: 10,
                        padding: "10px 14px",
                        marginBottom: 14,
                        border: `1px solid ${C.border}`,
                        fontSize: 12,
                        color: C.text2,
                        lineHeight: 1.6,
                      }}
                    >
                      💡 Only enter prices you saw today. Leave blank if you
                      didn't see that fuel type.
                    </div>
                    <button
                      style={{
                        ...S.accentBtn,
                        opacity: add91 || add95 || addDsl ? 1 : 0.4,
                        cursor:
                          add91 || add95 || addDsl ? "pointer" : "default",
                        fontSize: 16,
                        padding: 16,
                      }}
                      onClick={submitAddPrice}
                    >
                      Submit price ✓
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ BOYCOTT TAB ══ */}
        {tab === "boycott" && (
          <div style={S.section}>
            <div
              style={{
                fontSize: 13,
                color: C.text2,
                marginBottom: 14,
                lineHeight: 1.7,
                background: C.card,
                borderRadius: 12,
                padding: "12px 14px",
                border: `1px solid ${C.border}`,
              }}
            >
              🚫 NZ fuel companies hiked prices blaming the Iran war — but that
              fuel was{" "}
              <strong style={{ color: C.accent }}>already in NZ</strong> when
              prices went up. Vote with your wallet.
            </div>
            {[...boycottStations]
              .sort((a, b) => b.bl - a.bl)
              .map((s) => {
                const good = s.bl < 30;
                const barCol = good ? C.green : s.bl > 70 ? C.red : C.orange;
                return (
                  <div
                    key={s.id}
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      padding: "14px 16px",
                      marginBottom: 8,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 11,
                          background: s.bg + "22",
                          border: `2px solid ${s.bg}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontWeight: 800,
                          fontSize: 12,
                          color: s.bg,
                        }}
                      >
                        {s.logo}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            marginBottom: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {s.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 9px",
                              borderRadius: 20,
                              fontWeight: 700,
                              background: good ? C.green + "22" : C.red + "22",
                              color: good ? C.green : C.red,
                            }}
                          >
                            {good ? "Fair pricing" : s.hike + " hike"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.text2,
                            marginBottom: 8,
                            lineHeight: 1.5,
                          }}
                        >
                          {s.reason}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: C.text2,
                            marginBottom: 5,
                          }}
                        >
                          {s.votes.toLocaleString()} boycotting · {s.bl}%
                          pressure
                        </div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: C.border,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${s.bl}%`,
                              background: barCol,
                              borderRadius: 3,
                              transition: "width .6s",
                              boxShadow: `0 0 8px ${barCol}66`,
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          {voted[s.id] ? (
                            <div
                              style={{
                                background: C.green + "22",
                                color: C.green,
                                padding: "9px 16px",
                                borderRadius: 9,
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              ✓ Pledged
                            </div>
                          ) : (
                            <button
                              style={{
                                background: good ? C.green : C.red,
                                color: good ? C.bg : "#fff",
                                border: "none",
                                padding: "9px 18px",
                                borderRadius: 9,
                                fontSize: 13,
                                fontWeight: 800,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                              onClick={() => doBoycott(s.id)}
                            >
                              {good ? "Support" : "Boycott"}
                            </button>
                          )}
                          <button
                            style={{
                              background: C.card2,
                              color: C.blue,
                              border: `1px solid ${C.border}`,
                              padding: "9px 16px",
                              borderRadius: 9,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                            onClick={() => setShareModal(s)}
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ══ FORECAST TAB ══ */}
        {tab === "forecast" && (
          <div style={S.section}>
            {/* Oil panel */}
            <div
              style={{
                background: C.card,
                borderRadius: 16,
                padding: "16px 18px",
                marginBottom: 14,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text2,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 3,
                    }}
                  >
                    Brent Crude · Live
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: oilColor,
                      letterSpacing: -1,
                      lineHeight: 1,
                    }}
                  >
                    ${oil.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: oilColor,
                      marginTop: 4,
                      fontWeight: 700,
                    }}
                  >
                    {oilArrow} {oilChg >= 0 ? "+" : ""}
                    {oilChg.toFixed(2)} USD/bbl
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text2,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 3,
                    }}
                  >
                    NZ Pump Est.
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: C.accent,
                      letterSpacing: -0.5,
                    }}
                  >
                    ${nzPrice}
                  </div>
                  <div style={{ fontSize: 12, color: C.text2 }}>per litre</div>
                </div>
              </div>
              <SparkLine data={oilHist} color={oilColor} height={60} />
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: C.text,
                marginBottom: 10,
              }}
            >
              What if the war situation changes?
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.text2,
                marginBottom: 14,
                lineHeight: 1.6,
                background: C.card,
                borderRadius: 10,
                padding: "10px 12px",
                border: `1px solid ${C.border}`,
              }}
            >
              🛢️ NZ fuel was purchased 6–8 weeks ago. Any immediate price hike
              based on current events ={" "}
              <strong style={{ color: C.red }}>pure corporate profit</strong>.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {SCENARIOS.map((sc) => (
                <div
                  key={sc.id}
                  style={{
                    background: C.card,
                    borderRadius: 14,
                    padding: "14px",
                    cursor: "pointer",
                    border: `1px solid ${
                      activeSc === sc.id ? C.accent : C.border
                    }`,
                    transition: "border .15s",
                    boxShadow:
                      activeSc === sc.id ? `0 0 16px ${C.accent}22` : "none",
                  }}
                  onClick={() => runForecast(sc)}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{sc.icon}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: 3,
                    }}
                  >
                    {sc.label}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.text2, marginBottom: 8 }}
                  >
                    {sc.desc}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: sc.delta > 0 ? C.red : C.green,
                    }}
                  >
                    {sc.delta > 0 ? "▲ +" : "▼ "}
                    {sc.delta} USD/bbl → ${(oil + sc.delta).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {forecasting && (
              <div
                style={{
                  background: C.card,
                  borderRadius: 14,
                  padding: "28px",
                  textAlign: "center",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div style={S.spinner} />
                <div style={{ fontSize: 14, color: C.text2, marginTop: 10 }}>
                  AI analysing price impact...
                </div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>
                  Oil futures · NZD/USD · NZ supply pipeline
                </div>
              </div>
            )}

            {forecastErr && (
              <div
                style={{
                  background: C.card,
                  borderRadius: 14,
                  padding: 16,
                  textAlign: "center",
                  color: C.red,
                  fontSize: 14,
                  border: `1px solid ${C.red}44`,
                }}
              >
                Analysis failed — tap a scenario to retry.
              </div>
            )}

            {forecast &&
              !forecasting &&
              (() => {
                const isG = forecast.verdict === "GOUGE",
                  isJ = forecast.verdict === "JUSTIFIED";
                const vc = isG ? C.red : isJ ? C.green : C.orange;
                const sc = SCENARIOS.find((s) => s.id === activeSc);
                return (
                  <div
                    style={{
                      background: C.card,
                      borderRadius: 16,
                      overflow: "hidden",
                      border: `1px solid ${vc}55`,
                      boxShadow: `0 0 24px ${vc}11`,
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "16px 18px",
                        background: vc + "11",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: C.text,
                          }}
                        >
                          {sc?.icon} {sc?.label}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontWeight: 800,
                            background: vc + "22",
                            color: vc,
                            border: `1px solid ${vc}44`,
                          }}
                        >
                          {isG
                            ? "⚠ PRICE GOUGING"
                            : isJ
                            ? "✓ JUSTIFIED"
                            : "⚡ MIXED"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: C.text2,
                          lineHeight: 1.5,
                        }}
                      >
                        {forecast.verdictReason}
                      </div>
                    </div>
                    {/* Stats grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                      }}
                    >
                      {[
                        {
                          l: "NZ price change",
                          v: forecast.nzPriceChange,
                          c: vc,
                          big: true,
                        },
                        {
                          l: "New pump price",
                          v: forecast.newPumpPrice,
                          c: C.text,
                          big: true,
                        },
                        {
                          l: "Pure gouge/litre",
                          v: forecast.gougeAmount,
                          c: C.red,
                          big: true,
                        },
                        {
                          l: "When you'd feel it",
                          v: forecast.timeframe,
                          c: C.text,
                          big: false,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "14px 18px",
                            borderRight:
                              i % 2 === 0 ? `1px solid ${C.border}` : "none",
                            borderBottom:
                              i < 2 ? `1px solid ${C.border}` : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: C.text2,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                              marginBottom: 4,
                            }}
                          >
                            {item.l}
                          </div>
                          <div
                            style={{
                              fontSize: item.big ? 22 : 13,
                              fontWeight: item.big ? 800 : 500,
                              color: item.c,
                              letterSpacing: item.big ? -0.5 : 0,
                            }}
                          >
                            {item.v}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Detail rows */}
                    {[
                      {
                        k: "Their excuse",
                        v: forecast.corporateExcuse,
                        c: C.red,
                      },
                      {
                        k: "What's fair",
                        v: forecast.fairIncrease,
                        c: C.green,
                      },
                      {
                        k: "Your move",
                        v: forecast.driverTip,
                        c: C.accent,
                        bold: true,
                      },
                    ].map((row, i, arr) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 18px",
                          borderBottom:
                            i < arr.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                          gap: 14,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: C.text2,
                            flexShrink: 0,
                            fontWeight: 600,
                          }}
                        >
                          {row.k}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: row.c,
                            fontWeight: row.bold ? 800 : 400,
                            textAlign: "right",
                            lineHeight: 1.5,
                          }}
                        >
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}

            {/* Oil watch mini */}
            <div
              style={{
                marginTop: 14,
                background: C.card,
                borderRadius: 12,
                padding: "12px 14px",
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {[
                  { val: fmtK(totalVotes()), lbl: "Boycotting", color: C.red },
                  { val: "+18c", lbl: "Avg hike/wk", color: C.red },
                  { val: "$9", lbl: "Extra/50L", color: C.orange },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div
                      style={{ fontSize: 18, fontWeight: 800, color: s.color }}
                    >
                      {s.val}
                    </div>
                    <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div
                key={factIdx}
                style={{
                  fontSize: 12,
                  color: C.text2,
                  lineHeight: 1.6,
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 10,
                }}
              >
                <span
                  style={{ color: C.accent, fontWeight: 700, marginRight: 6 }}
                >
                  FACT
                </span>
                {FACTS[factIdx]}
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>

      {/* SHARE MODAL */}
      {shareModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 9999,
            padding: "0 0 20px",
          }}
          onClick={() => setShareModal(null)}
        >
          <div
            style={{
              background: C.card,
              borderRadius: "20px 20px 16px 16px",
              width: "100%",
              maxWidth: 430,
              border: `1px solid ${C.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 20px 0" }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.text,
                  marginBottom: 14,
                }}
              >
                Share to socials
              </div>
              <div
                style={{
                  background: C.card2,
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 14,
                  color: C.text2,
                  lineHeight: 1.7,
                  marginBottom: 16,
                  border: `1px solid ${C.border}`,
                }}
              >
                Boycotting {shareModal.name} NZ — raised petrol{" "}
                {shareModal.hike} blaming the Iran war, fuel was already in NZ.
                Join {shareModal.votes.toLocaleString()} Kiwis. #Nozl
                #FuelFightNZ
              </div>
            </div>
            <div
              style={{
                padding: "0 20px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                style={S.accentBtn}
                onClick={() => {
                  const txt = `Boycotting ${
                    shareModal.name
                  } NZ — raised petrol ${
                    shareModal.hike
                  } blaming the Iran war, fuel was already in NZ. Join ${shareModal.votes.toLocaleString()} Kiwis. #Nozl #FuelFightNZ`;
                  navigator.clipboard.writeText(txt).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "✓ Copied!" : "Copy text"}
              </button>
              <button
                style={{
                  background: C.card2,
                  color: C.blue,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Boycotting ${shareModal.name} NZ — raised petrol ${shareModal.hike} blaming Iran war but fuel was already here. #Nozl #FuelFightNZ`
                    )}`,
                    "_blank"
                  )
                }
              >
                Post to X
              </button>
              <button
                style={{
                  background: C.card2,
                  color: C.text2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                onClick={() => setShareModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  root: {
    background: C.bg,
    minHeight: "100vh",
    fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
    WebkitFontSmoothing: "antialiased",
  },
  ticker: {
    background: C.accent,
    overflow: "hidden",
    padding: "6px 0",
    whiteSpace: "nowrap",
  },
  tickerInner: {
    display: "inline-flex",
    animation: "ticker 32s linear infinite",
  },
  tickerSeg: {
    fontSize: 11,
    fontWeight: 800,
    color: C.bg,
    paddingRight: 52,
    letterSpacing: 0.2,
  },
  subtitle: { fontSize: 11, color: C.text2, marginTop: 2 },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: C.green + "22",
    border: `1px solid ${C.green}55`,
    padding: "4px 10px",
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: C.green,
    animation: "pulse 1.2s ease-in-out infinite",
  },
  liveLabel: { fontSize: 11, fontWeight: 700, color: C.green },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: C.card,
    borderRadius: 12,
    padding: "10px 14px",
    border: `1px solid ${C.border}`,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    color: C.text,
    background: "transparent",
    fontFamily: "inherit",
  },
  fuelPill: {
    padding: "7px 16px",
    borderRadius: 20,
    border: `1px solid ${C.border}`,
    background: C.card,
    fontSize: 13,
    fontWeight: 700,
    color: C.text2,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  fuelPillOn: {
    background: C.accent + "22",
    color: C.accent,
    border: `1px solid ${C.accent}`,
  },
  bottomNav: {
    display: "flex",
    background: C.card,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
  },
  navBtn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 4px 8px",
    border: "none",
    background: "transparent",
    color: C.text2,
    cursor: "pointer",
    fontFamily: "inherit",
    borderBottom: "2px solid transparent",
  },
  navBtnOn: { color: C.accent, borderBottom: `2px solid ${C.accent}` },
  section: { padding: "14px 16px 0" },
  priceBanner: {
    background: C.card,
    borderRadius: 16,
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    border: `1px solid ${C.border}`,
    gap: 12,
  },
  cheapestCard: {
    background: C.card,
    borderRadius: 16,
    padding: "16px 18px",
    marginBottom: 10,
    border: `2px solid ${C.green}`,
    boxShadow: `0 0 20px ${C.green}22`,
  },
  spinner: {
    width: 24,
    height: 24,
    border: `2.5px solid ${C.border}`,
    borderTopColor: C.accent,
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
    margin: "0 auto",
  },
  accentBtn: {
    background: C.accent,
    color: C.bg,
    border: "none",
    borderRadius: 12,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: C.accent,
    color: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 900,
    flexShrink: 0,
  },
};

const styleEl = document.createElement("style");
styleEl.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  input::placeholder { color: ${C.text3}; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
`;
document.head.appendChild(styleEl);
