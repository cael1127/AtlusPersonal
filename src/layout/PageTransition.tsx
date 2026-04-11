import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Motion } from "../lib/motion/tokens";
import { TransitionVariant } from "../config/routeMeta";

export function PageTransition({
  reducedMotion,
  transitionMap,
  children,
}: {
  reducedMotion: boolean;
  transitionMap: Record<string, TransitionVariant>;
  children: React.ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const previousPathRef = useRef<string>("/");
  const location = useLocation();

  useLayoutEffect(() => {
    const el = shellRef.current;
    const veil = veilRef.current;
    if (!el || !veil) return;
    gsap.killTweensOf(el);
    gsap.killTweensOf(veil.children);

    const variant = transitionMap[location.pathname] ?? "about";
    const routeOrder = ["/", "/about", "/projects", "/skills", "/experience", "/contact"];
    const prevPath = previousPathRef.current;
    const prevIndex = routeOrder.indexOf(prevPath);
    const nextIndex = routeOrder.indexOf(location.pathname);
    const direction = prevIndex >= 0 && nextIndex >= 0 && nextIndex < prevIndex ? -1 : 1;
    previousPathRef.current = location.pathname;
    const variantMotion = Motion.route.variants[variant] ?? Motion.route.variants.about;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      gsap.set(veil.children, { scaleX: 0, transformOrigin: "left center" });
      return;
    }

    const timeline = gsap.timeline();
    let panelOrigin = "left center";
    let panelY: number[] = [0, 0, 0];
    let panelX: number[] = [0, 0, 0];
    let panelSkew: number[] = [0, 0, 0];
    let panelFromScaleX = 0;
    let panelFromScaleY = 1;
    let contentY = 12;
    let contentX = direction * 12;

    if (variant === "about") {
      panelOrigin = direction > 0 ? "left center" : "right center";
      panelY = [-16 * direction, 0, 16 * direction];
      panelSkew = [7 * direction, 0, -7 * direction];
      contentY = 8;
      contentX = direction * 8;
    } else if (variant === "projects") {
      panelOrigin = direction > 0 ? "left center" : "right center";
      panelX = [-20 * direction, 0, 16 * direction];
      panelY = [0, 0, 0];
      panelSkew = [0, 0, 0];
      contentY = 14;
      contentX = direction * 20;
    } else if (variant === "skills") {
      panelOrigin = direction > 0 ? "right center" : "left center";
      panelFromScaleY = 0;
      panelX = [0, 0, 0];
      panelY = [0, 0, 0];
      panelSkew = [0, 0, 0];
      contentY = 18;
      contentX = direction * 18;
    } else if (variant === "experience") {
      panelOrigin = direction > 0 ? "left center" : "right center";
      panelY = [-12, 0, 12];
      panelX = [0, direction * 8, direction * 16];
      contentY = 16;
      contentX = direction * 14;
    } else if (variant === "contact") {
      panelOrigin = direction > 0 ? "right center" : "left center";
      panelX = [direction * 28, direction * 14, 0];
      panelY = [0, 0, 0];
      contentY = 10;
      contentX = direction * 24;
    }

    timeline.fromTo(
      veil.children,
      {
        scaleX: panelFromScaleX,
        scaleY: panelFromScaleY,
        transformOrigin: panelOrigin,
        x: (_, i) => panelX[i] ?? 0,
        y: (_, i) => panelY[i] ?? 0,
        skewY: (_, i) => panelSkew[i] ?? 0,
      },
      {
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        skewY: 0,
        duration: variantMotion.overlay,
        stagger: variantMotion.stagger,
        ease: Motion.ease.impact,
      },
      0,
    );

    timeline.fromTo(
      el,
      { opacity: 0, y: contentY, x: contentX, scale: 0.985, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: variantMotion.content,
        ease: Motion.ease.glide,
      },
      0.09,
    );

    timeline.to(
      veil.children,
      {
        scaleX: 0,
        scaleY: panelFromScaleY,
        duration: variantMotion.overlay * 0.82,
        stagger: variantMotion.stagger,
        ease: Motion.ease.impact,
      },
      0.15,
    );
  }, [location.pathname, reducedMotion, transitionMap]);

  return (
    <>
      <div
        className="PageTransition__veil"
        data-variant={transitionMap[location.pathname] ?? "about"}
        ref={veilRef}
        aria-hidden="true"
      >
        <div className="PageTransition__panel PageTransition__panel--ink" />
        <div className="PageTransition__panel PageTransition__panel--blood" />
        <div className="PageTransition__panel PageTransition__panel--paper" />
      </div>
      <div ref={shellRef} className="PageTransition">
        {children}
      </div>
    </>
  );
}
