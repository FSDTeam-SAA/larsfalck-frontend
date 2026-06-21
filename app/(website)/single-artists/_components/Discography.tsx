"use client";

import { useState } from "react";
import MusicCard from "./MusicCard";
export type MusicItem = {
  id: number;
  title: string;
  artist: string;
  year: number;
  type: "Album" | "Single";
  duration: string;
  image: string;
};

const tabs = ["All", "Albums", "Singles"];

export const musicData: MusicItem[] = [
  {
    id: 1,
    title: "Relaxing Piano Collection",
    artist: "Ethan",
    year: 2025,
    type: "Album",
    duration: "5 min 05 sec",
    image: "/albam.png",
  },
  {
    id: 2,
    title: "Urban Lounge",
    artist: "Unknown",
    year: 2025,
    type: "Single",
    duration: "4 min 05 sec",
    image: "/albam.png",
  },
  {
    id: 3,
    title: "Deep Focus Sessions",
    artist: "Emma Rhodes",
    year: 2025,
    type: "Album",
    duration: "6 min 10 sec",
    image: "/albam.png",
  },
  {
    id: 4,
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    year: 2025,
    type: "Single",
    duration: "5 min 00 sec",
    image: "/albam.png",
  },
  {
    id: 5,
    title: "Zen Journey",
    artist: "Unknown",
    year: 2025,
    type: "Single",
    duration: "6 min 15 sec",
    image: "/albam.png",
  },
];

export default function Discography() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredData =
    activeTab === "All"
      ? musicData
      : activeTab === "Albums"
      ? musicData.filter((item) => item.type === "Album")
      : musicData.filter((item) => item.type === "Single");

  return (
    <section className="min-h-screen text-white p-6 md:p-10">

      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Discography
      </h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeTab === tab
                ? "bg-green-500 text-black"
                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((item) => (
          <MusicCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}