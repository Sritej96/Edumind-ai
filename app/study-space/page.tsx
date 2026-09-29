"use client";

import { useState } from "react";

const subjects = [
  {
    name: "Java",
    icon: "☕",
    color: "from-orange-500/20 to-red-500/10",
    topics: ["Basics", "OOP", "Arrays", "Strings", "Collections"],
  },
  {
    name: "Python",
    icon: "🐍",
    color: "from-yellow-500/20 to-blue-500/10",
    topics: ["Basics", "Functions", "Pandas", "NumPy", "Data Analysis"],
  },
  {
    name: "SQL",
    icon: "🗄️",
    color: "from-cyan-500/20 to-blue-500/10",
    topics: ["SELECT", "Joins", "Functions", "Subqueries", "Practice"],
  },
  {
    name: "Electronics",
    icon: "⚡",
    color: "from-purple-500/20 to-pink-500/10",
    topics: ["Digital Logic", "Signals", "Microcontrollers", "IoT", "Communication"],
  },
];

export default function StudySpace() {
  const [selectedSubject, setSelectedSubject] = useState("Java");
  const [selectedTopic, setSelectedTopic] = useState("Basics");

  const subject = subjects.find(
    (item) => item.name === selectedSubject
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[-150px] h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute right-[-150px] top-[20%] h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-8">

        {/* NAVBAR */}
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-xl">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 font-black shadow-lg shadow-blue-500/20">
              E
            </div>

            <div>
              <h1 className="text-lg font-bold">
                EduMind
              </h1>
              <p className="text-[10px] text-slate-500">
                DIGITAL STUDY SPACE
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="/"
              className="text-slate-400 transition hover:text-white"
            >
              Home
            </a>

            <a
              href="/study-space"
              className="text-white"
            >
              Study Space
            </a>

            <span className="cursor-pointer text-slate-500">
              Progress
            </span>
          </div>

          <a
            href="/"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105"
          >
            AI Tutor
          </a>
        </nav>

        {/* HEADER */}
        <section className="py-12 sm:py-16">

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300">
              📚 YOUR STUDY SPACE
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
              Learn at your
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}own pace.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              Choose a subject, pick a topic, and build your understanding
              step by step with EduMind.
            </p>
          </div>

          {/* SUBJECTS */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {subjects.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelectedSubject(item.name);
                  setSelectedTopic(item.topics[0]);
                }}
                className={`rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                  selectedSubject === item.name
                    ? "border-blue-400/40 bg-blue-500/10 shadow-lg shadow-blue-900/10"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-2xl`}
                >
                  {item.icon}
                </div>

                <h3 className="mt-5 font-semibold">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.topics.length} learning topics
                </p>
              </button>
            ))}

          </div>
        </section>

        {/* STUDY AREA */}
        <section className="grid gap-6 pb-16 lg:grid-cols-[0.75fr_1.25fr]">

          {/* TOPICS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                  SUBJECT
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {selectedSubject}
                </h3>
              </div>

              <span className="rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-300">
                {subject?.topics.length} topics
              </span>
            </div>

            <div className="mt-6 space-y-2">
              {subject?.topics.map((topic, index) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                    selectedTopic === topic
                      ? "bg-blue-500/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                      selectedTopic === topic
                        ? "bg-blue-500 text-white"
                        : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="text-sm">
                    {topic}
                  </span>

                  {selectedTopic === topic && (
                    <span className="ml-auto text-blue-400">
                      →
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* CURRENT TOPIC */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.035] to-purple-500/[0.08] p-7">

            <div className="absolute right-[-50px] top-[-50px] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cyan-400">
                    CURRENT TOPIC
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {selectedTopic}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {selectedSubject} · Learning module
                  </p>
                </div>

                <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl sm:flex">
                  {subject?.icon}
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Topic progress
                  </span>

                  <span className="text-cyan-400">
                    0%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>

              </div>

              {/* STUDY OPTIONS */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">

                <a
                  href={`/?topic=${encodeURIComponent(
                    selectedSubject + " " + selectedTopic
                  )}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="text-xl">🧠</div>
                  <p className="mt-3 text-sm font-semibold">
                    Learn
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Ask the AI tutor
                  </p>
                </a>

                <div className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-1 hover:border-purple-400/30">
                  <div className="text-xl">📝</div>
                  <p className="mt-3 text-sm font-semibold">
                    Notes
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Create study notes
                  </p>
                </div>

                <div className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-1 hover:border-blue-400/30">
                  <div className="text-xl">🎯</div>
                  <p className="mt-3 text-sm font-semibold">
                    Practice
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Test your knowledge
                  </p>
                </div>

              </div>

              {/* START BUTTON */}
              <a
                href="/"
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold transition hover:scale-[1.01]"
              >
                Start learning with EduMind →
              </a>

            </div>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600">
          © 2026 EduMind AI · Learn beyond the classroom.
        </footer>

      </div>
    </main>
  );
}