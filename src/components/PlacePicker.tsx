import { useEffect, useId, useRef, useState } from "react";
import { places } from "../data/projects";

export default function PlacePicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const index = places.findIndex((place) => place.id === selected);
  const [active, setActive] = useState(index);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const prefix = useId();
  const labelId = `${prefix}-label`;
  const listId = `${prefix}-places`;
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  };
  const show = () => {
    setActive(index);
    setOpen(true);
  };
  const choose = (i: number) => {
    onSelect(places[i].id);
    close(true);
  };
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open)
      list.current
        ?.querySelector(`#${CSS.escape(`${prefix}-${active}`)}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, active, prefix]);
  return (
    <div
      ref={root}
      className="place-picker"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <div className="place-picker-label">
        <span id={labelId}>Explore a place</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {places.length}
        </span>
      </div>
      <button
        ref={trigger}
        className="place-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Explore a place: ${places[index].label}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            show();
          }
        }}
      >
        {places[index].label}
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 7 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${prefix}-${active}`}
          className="place-picker-menu"
          data-lenis-prevent
          onKeyDown={(event) => {
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              setActive((i) =>
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? places.length - 1
                    : (i +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        places.length) %
                      places.length,
              );
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(active);
            } else if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close(true);
            } else if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
              const match = places.findIndex((_, i) =>
                places[(active + 1 + i) % places.length].label
                  .toLowerCase()
                  .startsWith(event.key.toLowerCase()),
              );
              if (match !== -1) setActive((active + 1 + match) % places.length);
            }
          }}
        >
          {places.map((place, i) => (
            <div
              key={place.id}
              id={`${prefix}-${i}`}
              role="option"
              aria-selected={place.id === selected}
              className={`place-picker-option ${i === active ? "is-active" : ""}`}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(i)}
            >
              <span>{place.label}</span>
              <span aria-hidden="true">
                {place.id === selected ? "✓" : "↗"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
