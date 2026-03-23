"use client";

import dynamic from "next/dynamic";

const HuePicker = dynamic(() => import("./HuePicker"), { ssr: false });

export default function HuePickerLoader() {
  // if (process.env.NODE_ENV !== "development") return null;
  return <HuePicker />;
}
