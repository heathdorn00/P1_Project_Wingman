"use client";

import { AgentStatusGrid } from "@/components/dashboard/AgentStatusGrid";
import { AirmanProgressCard } from "@/components/dashboard/AirmanProgressCard";
import { AirmanStoryTracker } from "@/components/dashboard/AirmanStoryTracker";
import { CoachingLogFeed } from "@/components/dashboard/CoachingLogFeed";
import { DoraMetricsPanel } from "@/components/dashboard/DoraMetricsPanel";
import { SprintVelocityChart } from "@/components/dashboard/SprintVelocityChart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export default function WingmanDashboard() {
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [systemStatus] = useState<"nominal" | "degraded" | "offline">("nominal");

  useEffect(() => {
    const tick = () => setLastUpdated(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Platform One · STAR Flight</span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              PROJECT WINGMAN
            </h1>
            <span className="text-xs text-zinc-400">AI Mentorship Operations Center</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-zinc-500">SYSTEM STATUS</div>
            <Badge
              variant="outline"
              className={
                systemStatus === "nominal"
                  ? "border-green-500 text-green-400"
                  : systemStatus === "degraded"
                  ? "border-yellow-500 text-yellow-400"
                  : "border-red-500 text-red-400"
              }
            >
              {systemStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500">LAST SYNC</div>
            <div className="text-sm text-zinc-300">{lastUpdated}</div>
          </div>
        </div>
      </header>

      {/* Tier Banner */}
      <div className="flex border-b border-zinc-800">
        {[
          { label: "TRAIN", color: "bg-blue-900/40 border-blue-700", count: 3, desc: "Career Acceleration" },
          { label: "COACH", color: "bg-violet-900/40 border-violet-700", count: 7, desc: "Skill Development" },
          { label: "CATCH", color: "bg-orange-900/40 border-orange-700", count: 5, desc: "Quality Gates" },
        ].map((tier) => (
          <div key={tier.label} className={`flex-1 px-6 py-3 border-r border-zinc-800 ${tier.color} border-b-2`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-400">{tier.desc}</div>
                <div className="text-lg font-bold tracking-widest">{tier.label}</div>
              </div>
              <div className="text-3xl font-bold text-zinc-300">{tier.count}</div>
            </div>
          </div>
        ))}
        {/* Summary stats */}
        <div className="flex items-center gap-8 px-8">
          {[
            { label: "AGENTS ACTIVE", value: "15/15" },
            { label: "AIRMEN ENROLLED", value: "4" },
            { label: "SPRINT", value: "#3" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 grid grid-cols-12 gap-4">

        {/* Row 1: Agents (full width) */}
        <section className="col-span-12">
          <SectionHeader label="AGENT ROSTER" sub="15 AI Mentors · 3 LLM Providers · Live Status" />
          <AgentStatusGrid />
        </section>

        <div className="col-span-12"><Separator className="bg-zinc-800" /></div>

        {/* Row 2: Airmen (8) + DORA (4) */}
        <section className="col-span-8">
          <SectionHeader label="AIRMAN PROGRESSION" sub="1D7X1Z · 3-Level → 5-Level Upgrade Tracking" />
          <div className="grid grid-cols-2 gap-3">
            {["Alpha", "Bravo", "Charlie", "Delta"].map((callsign) => (
              <AirmanProgressCard key={callsign} callsign={callsign} />
            ))}
          </div>
        </section>

        <section className="col-span-4">
          <SectionHeader label="DORA METRICS" sub="DevSecOps Research & Assessment" />
          <DoraMetricsPanel />
        </section>

        <div className="col-span-12"><Separator className="bg-zinc-800" /></div>

        {/* Row 3: Airman Story Tracker */}
        <section className="col-span-6">
          <SectionHeader label="STORY TRACKER — RODRIGUEZ" sub="Completed User Stories · Story Points Delivered" />
          <AirmanStoryTracker airmanId="rodriguez" />
        </section>

        <section className="col-span-6">
          <SectionHeader label="STORY TRACKER — DRAKE" sub="Completed User Stories · Story Points Delivered" />
          <AirmanStoryTracker airmanId="drake" />
        </section>

        <div className="col-span-12"><Separator className="bg-zinc-800" /></div>

        {/* Row 4: Velocity (7) + Coaching Log (5) */}
        <section className="col-span-7">
          <SectionHeader label="SPRINT VELOCITY" sub="Story Points Delivered · Sprints 1–3" />
          <SprintVelocityChart />
        </section>

        <section className="col-span-5">
          <SectionHeader label="COACHING LOG" sub="Live @mention feed · Socratic method in action" />
          <CoachingLogFeed />
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-3 flex justify-between text-xs text-zinc-600">
        <span>Digital Transformations LLC · AX Platform · MCP-Native Multi-Agent System</span>
        <span>UNCLASSIFIED // FOR OFFICIAL USE ONLY</span>
        <span>Pilot Week 3 of 12 · Est. Monthly Cost: $1,200</span>
      </footer>
    </main>
  );
}

function SectionHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">{label}</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>
      <p className="text-center text-xs text-zinc-600 mt-1">{sub}</p>
    </div>
  );
}
