export type TransitionVariant =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export const ROUTE_TRANSITION_META: Record<string, TransitionVariant> = {
  "/": "about",
  "/about": "about",
  "/projects": "projects",
  "/skills": "skills",
  "/experience": "experience",
  "/contact": "contact",
};

