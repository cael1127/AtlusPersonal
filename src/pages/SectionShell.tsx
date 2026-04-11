import {
  useEffect,
} from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Reduced to helper primitives so route pages can be fully bespoke.
 */
export function useEscapeToHub() {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/?menu=1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}

export function BackToHubLink({ className }: { className: string }) {
  return (
    <Link className={className} to="/?menu=1">
      ◀ Back
    </Link>
  );
}
