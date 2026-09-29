"use client";

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm EduMind. I'm ready to help you learn, practice, and understand difficult topics.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    const text = message.trim();

    if ((!text && !image) || loading) return;

    const userMessage = text || "Please analyze this image and explain it.";

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: image
          ? `${userMessage}\n\n📷 Image attached`
          : userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    const selectedImage = image;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          image: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);

      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Sorry, I couldn't respond: ${error.message}`
              : "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute right-[-150px] top-[10%] h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[130px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-8">

        {/* NAVBAR */}
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-lg font-black shadow-lg shadow-blue-500/20">
              E
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                EduMind
              </h1>

              <p className="text-[11px] text-slate-500">
                DIGITAL STUDY SPACE
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="/" className="text-white">
              Home
            </a>

            <a
              href="/study-space"
              className="transition hover:text-white"
            >
              Study Space
            </a>

            <span className="cursor-pointer text-slate-500">
              Progress
            </span>
          </div>

          <button
            onClick={() =>
              document
                .getElementById("ai-tutor")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105"
          >
            Start Learning
          </button>
        </nav>

        {/* HERO */}
        <section className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              AI-POWERED LEARNING
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your ideas.
              <br />
              Your questions.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your learning.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              EduMind gives you a personal AI study companion to
              understand concepts, create notes, practice questions,
              and explore new ideas.
            </p>

            {/* STATS */}
            <div className="mt-9 flex flex-wrap gap-3">

              <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                <p className="text-lg font-bold">24/7</p>
                <p className="text-[11px] text-slate-500">
                  AI assistance
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                <p className="text-lg font-bold">4+</p>
                <p className="text-[11px] text-slate-500">
                  Study modes
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                <p className="text-lg font-bold">∞</p>
                <p className="text-[11px] text-slate-500">
                  Questions
                </p>
              </div>

            </div>

            {/* QUICK ACTIONS */}
            <div className="mt-10">

              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Quick Study
              </p>

              <div className="grid max-w-xl grid-cols-2 gap-3">

                <button
                  onClick={() =>
                    setMessage("Explain a difficult concept to me")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-lg">
                    🧠
                  </div>

                  <p className="font-semibold">
                    Explain
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Break down difficult topics
                  </p>
                </button>

                <button
                  onClick={() =>
                    setMessage("Create simple study notes for me")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-400/[0.06]"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-400/10 text-lg">
                    📝
                  </div>

                  <p className="font-semibold">
                    Study Notes
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Turn topics into notes
                  </p>
                </button>

                <button
                  onClick={() =>
                    setMessage("Give me practice questions")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-400/[0.06]"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-lg">
                    🎯
                  </div>

                  <p className="font-semibold">
                    Practice
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Test what you know
                  </p>
                </button>

                <button
                  onClick={() =>
                    setMessage("Help me brainstorm ideas")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-pink-400/30 hover:bg-pink-400/[0.06]"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-pink-400/10 text-lg">
                    💡
                  </div>

                  <p className="font-semibold">
                    Brainstorm
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Explore new possibilities
                  </p>
                </button>

              </div>
            </div>
          </div>

          {/* AI TUTOR */}
          <div id="ai-tutor" className="relative">

            <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-purple-600/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1022]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">

              {/* CHAT HEADER */}
              <div className="border-b border-white/10 px-5 py-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl shadow-lg shadow-blue-500/20">
                      ✦
                    </div>

                    <div>
                      <p className="font-semibold">
                        EduMind Tutor
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        <p className="text-[11px] text-emerald-400">
                          Ready to help
                        </p>
                      </div>
                    </div>

                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-500">
                    MULTIMODAL AI
                  </span>

                </div>
              </div>

              {/* MESSAGES */}
              <div className="min-h-[390px] max-h-[390px] space-y-4 overflow-y-auto px-5 py-5">

                {messages.map((item, index) => (
                  <div
                    key={index}
                    className={
                      item.role === "user"
                        ? "ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg shadow-blue-900/20"
                        : "max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.045] p-4"
                    }
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                      {item.content}
                    </p>
                  </div>
                ))}

                {loading && (
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.045] p-4">

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:120ms]" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:240ms]" />

                      <span className="ml-1 text-xs text-slate-500">
                        Thinking...
                      </span>
                    </div>

                  </div>
                )}

              </div>

              {/* IMAGE PREVIEW */}
              {image && (
                <div className="border-t border-white/10 px-4 pt-4">

                  <div className="relative inline-block">

                    <img
                      src={image}
                      alt="Selected study material"
                      className="h-24 w-24 rounded-xl border border-white/10 object-cover"
                    />

                    <button
                      onClick={() => {
                        setImage(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg"
                    >
                      ×
                    </button>

                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    Image ready for analysis
                  </p>

                </div>
              )}

              {/* INPUT */}
              <div className="border-t border-white/10 p-4">

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 transition focus-within:border-blue-500/40">

                  {/* HIDDEN FILE INPUT */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* IMAGE BUTTON */}
                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={loading}
                    title="Upload an image"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg transition hover:border-cyan-400/40 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    📎
                  </button>

                  <input
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                      image
                        ? "Ask something about this image..."
                        : "Ask EduMind anything..."
                    }
                    className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={loading || (!message.trim() && !image)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-lg font-bold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ↑
                  </button>

                </div>

                <p className="mt-3 text-center text-[10px] text-slate-600">
                  Upload an image or ask a question. EduMind can analyze
                  study material, diagrams, charts, and text.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-white/10 py-16">

          <div className="mb-10">

            <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
              WHY EDUMIND
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to study smarter.
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              One simple space to ask questions, understand concepts,
              practice your knowledge, and explore study material.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                🧠
              </div>

              <h4 className="mt-6 text-xl font-semibold">
                Understand Better
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Get clear explanations instead of struggling through
                complicated concepts alone.
              </p>

            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-purple-400/20">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-2xl">
                🖼️
              </div>

              <h4 className="mt-6 text-xl font-semibold">
                Understand Images
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Upload diagrams, charts, screenshots, or study material
                and ask questions about them.
              </p>

            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/10 text-2xl">
                📚
              </div>

              <h4 className="mt-6 text-xl font-semibold">
                Learn Smarter
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Combine questions and visual study material in one
                learning workspace.
              </p>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-10">

          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 px-6 py-10 text-center sm:px-10">

            <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">

              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                START YOUR NEXT SESSION
              </p>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Have a question? Ask EduMind.
              </h3>

              <button
                onClick={() =>
                  document
                    .getElementById("ai-tutor")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-105"
              >
                Open AI Tutor
              </button>

            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600">
          © 2026 EduMind AI · Your digital study space.
        </footer>

      </div>
    </main>
  );
}