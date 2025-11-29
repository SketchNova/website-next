"use client";
import dynamic from "next/dynamic";
import React from "react";

const PhaserGame = dynamic(() => import("../../components/PhaserGame"), { ssr: false });

export default function GamePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <PhaserGame />
    </main>
  );
}

