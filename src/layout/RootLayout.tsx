import { Outlet } from "react-router-dom";
import { AmbientBackdrop } from "../components/fx/AmbientBackdrop";
import { TransitionVariant } from "../config/routeMeta";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PageTransition } from "./PageTransition";

export function RootLayout({
  transitionMap,
}: {
  transitionMap: Record<string, TransitionVariant>;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="AppRoot">
      <AmbientBackdrop reducedMotion={reducedMotion} />
      <PageTransition reducedMotion={reducedMotion} transitionMap={transitionMap}>
        <Outlet />
      </PageTransition>
    </div>
  );
}
