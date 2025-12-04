"use client";

import { Search } from "lucide-react";
import { type CSSProperties, type MouseEvent, useId, useState } from "react";

/**
 * Matches Inspira UI's "Input" demo: subtle pill input plus a radial glow that
 * tracks the cursor. The glow automatically respects rounded corners thanks to
 * border-radius inheritance.
 */
export function HaloSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [{ x, y }, setCoords] = useState({ x: 50, y: 50 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - left) / width) * 100;
    const nextY = ((event.clientY - top) / height) * 100;
    setCoords({ x: nextX, y: nextY });
  };

  return (
    <div className="flex h-56 w-full flex-col items-center justify-center gap-2">
      <label
        htmlFor={inputId}
        className="ml-4 w-full max-w-sm text-sm font-medium text-slate-600 dark:text-slate-200"
      >
        Hover over below input
      </label>

      <div
        className="group relative w-full max-w-sm rounded-2xl bg-[rgb(17,17,19)] px-1 py-1 transition-colors duration-300"
        onMouseMove={handleMove}
        onMouseLeave={() => setCoords({ x: 50, y: 50 })}
        style={
          {
            "--halo-x": `${x}%`,
            "--halo-y": `${y}%`,
          } as CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 -z-10 rounded-[inherit] opacity-0 blur-[2.5rem] transition duration-500 group-hover:opacity-100"
          style={{
            borderRadius: "inherit",
            background:
              "radial-gradient(circle at var(--halo-x) var(--halo-y), rgba(59,130,246,0.35), transparent 55%)",
          }}
        />

        <form
          className="relative flex items-center gap-3 rounded-xl bg-[rgb(34,34,38)] px-4 py-3 text-sm text-white/90 shadow-inner shadow-black/40 ring-1 ring-white/5 transition duration-200 group-hover:ring-white/20 focus-within:ring-white/40"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <Search className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <input
            id={inputId}
            type="search"
            placeholder="Hover over me"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="flex-1 bg-transparent text-base text-white placeholder:text-slate-400 focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
}

