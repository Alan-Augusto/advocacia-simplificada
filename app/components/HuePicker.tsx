"use client";

import { useState, useEffect, useRef } from "react";

const HUE_PRESETS = [
  { label: "Teal", value: 180 },
  { label: "Indigo", value: 264 },
  { label: "Violet", value: 270 },
  { label: "Blue", value: 220 },
  { label: "Emerald", value: 150 },
  { label: "Orange", value: 25 },
  { label: "Red", value: 0 },
];

export default function HuePicker() {
  const [hue, setHue] = useState(180);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Read current value from CSS if set
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-hue")
        .trim();
      if (current) setHue(Number(current));
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-hue", String(hue));
  }, [hue]);

  function copyValue() {
    navigator.clipboard.writeText(`--primary-hue: ${hue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Build a preview gradient for the slider track
  const trackGradient = `linear-gradient(to right, ${Array.from({ length: 7 }, (_, i) =>
    `oklch(63% 0.23 ${Math.round((i / 6) * 360)})`
  ).join(", ")})`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        zIndex: 9999,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        width: collapsed ? "auto" : "260px",
        transition: "width 0.2s ease",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px",
        color: "#1e293b",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: collapsed ? "0.5rem 0.75rem" : "0.625rem 0.875rem",
          cursor: "pointer",
          userSelect: "none",
          gap: "0.5rem",
        }}
        onClick={() => setCollapsed((c) => !c)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Live color dot */}
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: `oklch(63% 0.23 ${hue})`,
              flexShrink: 0,
              border: "1.5px solid rgba(0,0,0,0.1)",
            }}
          />
          {!collapsed && (
            <span style={{ fontWeight: 600, fontSize: "12px", color: "#64748b" }}>
              COR PRIMÁRIA
            </span>
          )}
        </div>
        <span style={{ fontSize: "10px", color: "#94a3b8" }}>
          {collapsed ? "▲" : "▼"}
        </span>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ padding: "0 0.875rem 0.875rem" }}>
          {/* Hue value display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>hue</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "18px",
                color: `oklch(55% 0.24 ${hue})`,
                letterSpacing: "-0.5px",
              }}
            >
              {hue}°
            </span>
          </div>

          {/* Slider */}
          <div style={{ position: "relative", marginBottom: "0.875rem" }}>
            <div
              style={{
                height: "8px",
                borderRadius: "4px",
                background: trackGradient,
                marginBottom: "4px",
              }}
            />
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                appearance: "none",
                background: "transparent",
                outline: "none",
                cursor: "pointer",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>

          {/* Presets */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginBottom: "0.75rem",
            }}
          >
            {HUE_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setHue(p.value)}
                title={`${p.label} (${p.value}°)`}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `oklch(63% 0.23 ${p.value})`,
                  border:
                    hue === p.value
                      ? "2.5px solid #1e293b"
                      : "2px solid transparent",
                  cursor: "pointer",
                  padding: 0,
                  outline: "none",
                  flexShrink: 0,
                  boxShadow:
                    hue === p.value
                      ? "0 0 0 1px rgba(255,255,255,0.8) inset"
                      : "none",
                  transition: "border 0.15s",
                }}
              />
            ))}
          </div>

          {/* Copy button */}
          <button
            onClick={copyValue}
            style={{
              width: "100%",
              padding: "0.4rem",
              borderRadius: "0.4rem",
              background: copied ? "#dcfce7" : "#f1f5f9",
              color: copied ? "#16a34a" : "#475569",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "11px",
              transition: "background 0.2s",
            }}
          >
            {copied ? "✓ Copiado!" : `Copiar: --primary-hue: ${hue};`}
          </button>
        </div>
      )}

      {/* Dev badge */}
      {!collapsed && (
        <div
          style={{
            padding: "0.3rem 0.875rem",
            borderTop: "1px solid #f1f5f9",
            color: "#94a3b8",
            fontSize: "10px",
            borderRadius: "0 0 0.875rem 0.875rem",
            background: "#fafafa",
          }}
        >
          DEV ONLY · não aparece em produção
        </div>
      )}
    </div>
  );
}
