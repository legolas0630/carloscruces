export interface Track {
  id: number;
  title: string;
  bpm: string;
  duration: string;
  color: string;
  img: string;
  desc: string;
  src: string; 
  sleeveImg?: string;
  genre: string;
  type: 'EP' | 'Single';
}

export interface MerchItem {
  id: number;
  name: string;
  price: string;
  img: string;
  tag: string;
}

export interface Visual {
  id: number;
  title: string;
  img: string;
  h: "tall" | "sq" | "wide";
}

export interface Expedition {
  id: number;
  title: string;
  date: string;
  location: string;
  img: string;
  body: string;
}

export const TRACKS: Track[] = [
  { 
    id: 1, title: "CUMBIA BEATS", bpm: "148 BPM", duration: "", color: "#a8ff00", 
    img: "/artwork/cumbia-malice.jpeg", 
    desc: "Industrial kick patterns layered over frozen sub frequencies.", 
    src: "/beats/cumbia-beats.mp3", genre: "TECHNO", type: "Single" 
  },
  { 
    id: 2, title: "CUMBIA LIFE", bpm: "105 BPM", duration: "", color: "#00ffcc", 
    img: "/artwork/cumbia-malice.jpeg", 
    desc: "Heavy bass meeting traditional rhythms.", 
    src: "/beats/cumbia-life.mp3", genre: "CUMBIA", type: "EP" 
  },
  { 
    id: 3, title: "CUMBIA FILES", bpm: "155 BPM", duration: "", color: "#ffffff", 
    img: "/artwork/asfalto.JPG", 
    desc: "Machine-soul transmissions filtered through industrial machinery.", 
    src: "/beats/cumbia-files.mp3", genre: "TECHNO", type: "Single" 
  },
  { 
    id: 4, title: "CUMBIA CONFESSIONS", bpm: "140 BPM", duration: "", color: "#ff4400", 
    img: "/artwork/cumbia-confessions.jpeg", 
    desc: "chill ambient cumbia house for late night rides and early morning rituals.", 
    src: "/beats/cumbia-confessions.mp3", genre: "Cumbia House", type: "Single" 
  },
  { 
    id: 5, title: "CUMBIA VILLERA", bpm: "105 BPM", duration: "", color: "#00ffcc", 
    img: "/artwork/cumbia-villera.jpeg", 
    desc: "Heavy bass meeting traditional Latin rhythms in a dark warehouse setting.", 
    src: "/beats/cumbia-villera.mp3", genre: "CUMBIA", type: "Single" 
  },
  { 
    id: 6, title: "Caida de Tlaloc", bpm: "152 BPM", duration: "", color: "#ff00cc", 
    img: "/artwork/caida-de-tlaloc.JPEG", 
    desc: "Aggressive industrial textures and high-velocity percussion.", 
    src: "/beats/caida-de-tlaloc.mp3", genre: "TECHNO", type: "Single" 
  }
];

export const MERCH: MerchItem[] = [
  { id: 1, name: "CRUCES ACID TEE", price: "€35", img: "https://via.placeholder.com/400x400/111111/a8ff00?text=ACID+TEE", tag: "LIMITED" },
  { id: 2, name: "RITUAL HOODIE", price: "€75", img: "https://via.placeholder.com/400x400/111111/f0f0f0?text=HOODIE", tag: "NEW" },
  { id: 3, name: "VOID SIGNAL CAP", price: "€28", img: "https://via.placeholder.com/400x400/111111/cc00ff?text=CAP", tag: "" },
  { id: 4, name: "SUBZERO PATCH SET", price: "€18", img: "https://via.placeholder.com/400x400/111111/00ffcc?text=PATCHES", tag: "BUNDLE" },
  { id: 5, name: "LOGO LONG SLEEVE", price: "€45", img: "https://via.placeholder.com/400x400/111111/a8ff00?text=LONGSLEEVE", tag: "" },
  { id: 6, name: "EXPEDITION JACKET", price: "€120", img: "https://via.placeholder.com/400x400/111111/ff4400?text=JACKET", tag: "COLLAB" },
];

export const VISUALS: Visual[] = [
  { id: 1, title: "ACID SERIES I", img: "https://via.placeholder.com/600x800/111111/a8ff00?text=ACID+SERIES", h: "tall" },
  { id: 2, title: "VOID POSTER", img: "https://via.placeholder.com/600x600/0d0d0d/cc00ff?text=VOID+POSTER", h: "sq" },
  { id: 3, title: "RITUAL ZINE", img: "https://via.placeholder.com/600x400/111111/00ffcc?text=RITUAL+ZINE", h: "wide" },
  { id: 4, title: "SUBZERO ART", img: "https://via.placeholder.com/600x600/0d0d0d/a8ff00?text=SUBZERO", h: "sq" },
  { id: 5, title: "DESCENT FLYER", img: "https://via.placeholder.com/600x900/111111/ff4400?text=DESCENT", h: "tall" },
  { id: 6, title: "CLUB NIGHTS", img: "https://via.placeholder.com/600x600/0d0d0d/f0f0f0?text=CLUB+NIGHTS", h: "sq" },
];

export const EXPEDITIONS: Expedition[] = [
  { id: 1, title: "SIERRA MADRE — DAY 3", date: "MAR 2024", location: "Guanajuato Highlands, MX", img: "https://via.placeholder.com/1200x600/0a0a0a/a8ff00?text=SIERRA+MADRE", body: "The ridgeline at 2800m. Wind strips everything back to pure signal. No phone, no BPM counter. Just altitude, breath, and the distant memory of bass frequencies still echoing in muscle tissue from the weekend before. The mountains metabolize sound differently. You hear silence as a composition." },
  { id: 2, title: "MEDITATION ON MACHINERY", date: "JAN 2024", location: "Abandoned Warehouse, CDMX", img: "https://via.placeholder.com/1200x600/0a0a0a/00ffcc?text=MACHINERY", body: "There is no difference between the hum of a transformer and a drone track. Both vibrate. Both ask you to let go. Sitting inside the abandoned textile factory, I understood that techno is not made — it is excavated from the industrial residue the world leaves behind." },
  { id: 3, title: "PRE-DAWN SUMMIT", date: "NOV 2023", location: "Cerro del Cubilete, GTO", img: "https://via.placeholder.com/1200x600/0a0a0a/ff4400?text=SUMMIT", body: "Headlamp. Cold air. The city lights below look like a circuit board. You reach the top before sunrise and understand why the ancients built temples on high places. The sky is a speaker. Every star a beat. Standing at the threshold between night and day, the next track writes itself." }
];
