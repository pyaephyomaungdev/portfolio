import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// HSV ↔ Hex helpers (HSV model gives the cleanest 2-D gradient UX)
// ---------------------------------------------------------------------------

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const sn = s / 100;
  const vn = v / 100;
  const f = (n: number): number => {
    const k = (n + h / 60) % 6;
    return vn - vn * sn * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// ---------------------------------------------------------------------------
// ColorPicker component
// ---------------------------------------------------------------------------

interface ColorPickerProps {
  /** Current hex color value (6-digit, e.g. "#f54e00") */
  value: string;
  /** Fires on every color change with a 6-digit hex string */
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const safe = isHex(value) ? value : "#f54e00";
  const [hsv, setHsv] = useState(() => hexToHsv(safe));
  const [hexInput, setHexInput] = useState(safe);

  // Tracks the last hex we emitted — prevents re-entrancy when the parent
  // reflects our own onChange back down via the `value` prop.
  const lastEmittedRef = useRef(safe.toLowerCase());

  // Always-current HSV for use inside event handlers without stale closures.
  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // ── Sync when external value changes (e.g. swatch click in parent) ────────
  useEffect(() => {
    if (!isHex(value)) return;
    const norm = value.toLowerCase();
    if (norm === lastEmittedRef.current) return; // came from our own emit
    lastEmittedRef.current = norm;
    setHsv(hexToHsv(value));
    setHexInput(value);
  }, [value]);

  // ── Emit helper ──────────────────────────────────────────────────────────
  function emit(h: number, s: number, v: number) {
    const hex = hsvToHex(h, s, v);
    lastEmittedRef.current = hex.toLowerCase();
    setHexInput(hex);
    onChange(hex);
  }

  // ── SV area (2-D saturation + value pick) ────────────────────────────────
  function pickSv(el: HTMLDivElement, cx: number, cy: number) {
    const rect = el.getBoundingClientRect();
    const s = clamp((cx - rect.left) / rect.width, 0, 1) * 100;
    const v = (1 - clamp((cy - rect.top) / rect.height, 0, 1)) * 100;
    const next = { h: hsvRef.current.h, s, v };
    setHsv(next);
    emit(next.h, next.s, next.v);
  }

  // ── Hue rail (1-D hue pick) ───────────────────────────────────────────────
  function pickHue(el: HTMLDivElement, cx: number) {
    const rect = el.getBoundingClientRect();
    const h = clamp((cx - rect.left) / rect.width, 0, 1) * 360;
    const { s, v } = hsvRef.current;
    const next = { h, s, v };
    setHsv(next);
    emit(next.h, next.s, next.v);
  }

  // ── Derived display values ────────────────────────────────────────────────
  const pureHue = hsvToHex(hsv.h, 100, 100);
  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
  const svLeft = `${clamp(hsv.s, 0, 100)}%`;
  const svTop = `${clamp(100 - hsv.v, 0, 100)}%`;
  const hueLeft = `${clamp((hsv.h / 360) * 100, 0, 100)}%`;

  return (
    <div className="space-y-2.5 select-none">

      {/* ── 2-D saturation / value gradient ─────────────────────────────── */}
      <div className="relative w-full h-36">
        {/* Gradient layer — overflow-hidden clips to rounded corners */}
        <div
          ref={svRef}
          role="presentation"
          className="absolute inset-0 rounded-lg cursor-crosshair touch-none overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, transparent, #000),
                         linear-gradient(to right, #fff, ${pureHue})`,
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pickSv(e.currentTarget, e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            pickSv(e.currentTarget, e.clientX, e.clientY);
          }}
        />
        {/* Thumb — sibling so it isn't clipped by the gradient's overflow-hidden */}
        <div
          aria-hidden
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none z-10"
          style={{
            left: svLeft,
            top: svTop,
            transform: "translate(-50%, -50%)",
            backgroundColor: currentHex,
          }}
        />
      </div>

      {/* ── Hue rail ─────────────────────────────────────────────────────── */}
      <div className="relative w-full h-5 flex items-center">
        {/* Rainbow gradient strip */}
        <div
          ref={hueRef}
          role="presentation"
          className="absolute inset-x-0 rounded-full cursor-pointer touch-none"
          style={{
            height: "10px",
            background:
              "linear-gradient(to right," +
              "hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%)," +
              "hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%)," +
              "hsl(360,100%,50%))",
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pickHue(e.currentTarget, e.clientX);
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            pickHue(e.currentTarget, e.clientX);
          }}
        />
        {/* Thumb */}
        <div
          aria-hidden
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none z-10"
          style={{
            left: hueLeft,
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: pureHue,
          }}
        />
      </div>

      {/* ── Preview swatch + HEX input ───────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-0.5">
        <div
          aria-hidden
          className="w-8 h-8 rounded-lg border border-rule shadow-2xs shrink-0"
          style={{ backgroundColor: currentHex }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            const raw = e.target.value;
            setHexInput(raw);
            const hex = raw.startsWith("#") ? raw : `#${raw}`;
            if (isHex(hex)) {
              lastEmittedRef.current = hex.toLowerCase();
              setHsv(hexToHsv(hex));
              onChange(hex);
            }
          }}
          onBlur={() => {
            const hex = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
            if (!isHex(hex)) setHexInput(currentHex);
          }}
          maxLength={7}
          placeholder="#f54e00"
          aria-label="Hex color value"
          className="flex-1 rounded-md border border-rule bg-paper px-2 py-1.5 font-mono text-xs text-ink focus:border-ink focus:outline-none"
        />
      </div>
    </div>
  );
}
