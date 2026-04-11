/** Main command menu entries — ids map to routes `/${id}`. */

export type MenuClipVariant = 0 | 1 | 2;

export interface CommandMenuItem {
  id: string;
  label: string;
  sub: string;
  clipVariant?: MenuClipVariant;
  offsetX?: number;
  offsetY?: number;
  /** Relative visual scale (1 = baseline). */
  scale?: number;
  /** Relative non-active visibility bias (1 = baseline). */
  depthBias?: number;
}

export const COMMAND_MENU_ITEMS: CommandMenuItem[] = [
  {
    id: "about",
    label: "About",
    sub: "Who I am",
    clipVariant: 0,
    offsetX: -2,
    offsetY: 0,
    scale: 1.1,
    depthBias: 1,
  },
  {
    id: "projects",
    label: "Projects",
    sub: "Selected works",
    clipVariant: 1,
    offsetX: 14,
    offsetY: -2,
    scale: 0.96,
    depthBias: 0.96,
  },
  {
    id: "skills",
    label: "Skills",
    sub: "Tools & craft",
    clipVariant: 2,
    offsetX: 8,
    offsetY: -6,
    scale: 0.9,
    depthBias: 0.9,
  },
  {
    id: "experience",
    label: "Experience",
    sub: "The journey so far",
    clipVariant: 0,
    offsetX: 18,
    offsetY: -8,
    scale: 0.84,
    depthBias: 0.84,
  },
  {
    id: "contact",
    label: "Contact",
    sub: "Let\u2019s connect",
    clipVariant: 1,
    offsetX: 12,
    offsetY: -10,
    scale: 0.92,
    depthBias: 0.88,
  },
];

export function pathForMenuId(id: string) {
  return `/${id}`;
}
