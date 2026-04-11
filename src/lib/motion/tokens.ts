export const Motion = {
  dur: {
    fast: 0.18,
    med: 0.32,
    slow: 0.7,
    xslow: 1.05,
  },
  ease: {
    snap: "cubic-bezier(0.2, 1.05, 0.15, 1)",
    soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    impact: "cubic-bezier(0.16, 1, 0.3, 1)",
    glide: "cubic-bezier(0.33, 1, 0.68, 1)",
  },
  menu: {
    enter: {
      scrim: 0.28,
      backdrop: 0.62,
      stack: 0.56,
      chrome: 0.52,
      hints: 0.34,
    },
    exit: {
      root: 0.2,
      scrim: 0.16,
      stack: 0.18,
    },
    stagger: {
      item: 0.09,
      chrome: 0.075,
    },
    parallax: {
      backdrop: 8,
      stack: 5,
      chrome: 18,
    },
    interaction: {
      focusPulse: 0.28,
      cursorGlide: 0.3,
      confirmDelay: 0.14,
      sceneKick: 0.18,
    },
  },
  route: {
    overlay: 0.36,
    content: 0.34,
    stagger: 0.06,
    variants: {
      about: { overlay: 0.34, content: 0.3, stagger: 0.05 },
      projects: { overlay: 0.44, content: 0.36, stagger: 0.07 },
      skills: { overlay: 0.4, content: 0.34, stagger: 0.06 },
      experience: { overlay: 0.38, content: 0.35, stagger: 0.055 },
      contact: { overlay: 0.36, content: 0.32, stagger: 0.065 },
    },
  },
} as const;

