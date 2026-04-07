export function ActionHints({
  hints,
}: {
  hints: Array<{ key: string; label: string }>;
}) {
  return (
    <div className="ActionHints" aria-label="Action hints">
      {hints.map((h) => (
        <div className="ActionHints__hint" key={`${h.key}-${h.label}`}>
          <span className="ActionHints__key">{h.key}</span>
          <span className="ActionHints__label">{h.label}</span>
        </div>
      ))}
    </div>
  );
}

