
import { GreetingOption } from './types';

export const GREETINGS: GreetingOption[] = [
  { id: 1, text: "2026 龍馬精神 🔥" },
  { id: 2, text: "馬上有錢，好運全開" },
  { id: 3, text: "新年快樂！Happy 2026" },
  { id: 4, text: "福馬到來，萬事 OK" },
  { id: 5, text: "前程似錦，一馬當先" },
  { id: 6, text: "財源滾滾，紅包拿來" },
  { id: 7, text: "吉星高照，歲歲平安" },
  { id: 8, text: "金馬迎春，大吉大利" }
];

export const ANIMALS = [
  "Horse (the main theme of 2026)",
  "Rabbit (a clever Zootopia citizen)",
  "Tiger (a bold and brave citizen)",
  "Fox (a witty and stylish citizen)",
  "Sheep (a soft and lucky citizen)"
];

export const SCENES = [
  "A bustling Taiwanese night market during Chinese New Year with floating red lanterns and steaming food stalls.",
  "A traditional Taiwanese courtyard (Sanheyuan) decorated with huge red couplets and firecrackers.",
  "A futuristic Zootopia-style Taipei city with neon red signs and flying gold ingots.",
  "A cozy indoor scene of a grand Lunar New Year reunion feast with red envelopes everywhere.",
  "A majestic temple entrance with intricate dragon carvings and thick red incense smoke."
];

export const PROMPT_BASE = `A high-end Disney Pixar 3D animated character portrait.

CORE IDENTITY REQUIREMENT: 
The character MUST be an identical 3D version of the person in the source photo. 
Maintain 100% accurate facial structure, eye shape, nose bridge, lip curve, and unique facial landmarks. 
The person must be INSTANTLY recognizable. Do not genericize the face. 
Translate their exact expression and facial proportions into Pixar's soft 3D aesthetic.

STYLE & THEME:
- Style: Cinematic Pixar 3D rendering with subsurface scattering on skin.
- Theme: 2026 Taiwanese Lunar New Year (Year of the Horse).
- Outfit: A high-fashion, detailed red silk Tang suit with intricate gold 2026 embroidery.
`;
