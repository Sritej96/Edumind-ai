"use client";

import { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Home() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  // PDF / RAG
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  // File inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // AI Chat
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading =
    status === "submitted" || status === "streaming";

  // -----------------------------
  // IMAGE SELECTION
  // -----------------------------
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFiles(e.target.files || undefined);
  };

  // -----------------------------
  // PDF UPLOAD
  // -----------------------------
  const handlePdfChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Check PDF
    if (selectedFile.type !== "application/pdf") {
      setPdfError("Please select a PDF file.");
      return;
    }

    setPdfFile(selectedFile);
    setPdfText("");
    setPdfError("");
    setPdfLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      let data: {
        success?: boolean;
        fileName?: string;
        text?: string;
        error?: string;
      } = {};

      // Safely parse JSON
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Server returned an invalid response: ${responseText}`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            `PDF upload failed with status ${response.status}`
        );
      }

      if (!data.text) {
        throw new Error(
          "PDF was uploaded, but no text could be extracted."
        );
      }

      setPdfText(data.text);
    } catch (error) {
      console.error("PDF upload error:", error);

      setPdfError(
        error instanceof Error
          ? error.message
          : "Failed to process PDF."
      );

      setPdfFile(null);
      setPdfText("");
    } finally {
      setPdfLoading(false);
    }
  };

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !message.trim() &&
      !files?.length &&
      !pdfText
    ) {
      return;
    }

    let finalMessage = message.trim();

    // If a PDF is uploaded, include its extracted
    // content as knowledge for the AI.
    if (pdfText) {
      finalMessage = `
You are EduMind AI.

Use the uploaded document below as your primary knowledge source.

--- START OF DOCUMENT ---
${pdfText}
--- END OF DOCUMENT ---

Answer the user's question based on the document when relevant.
If the answer is not available in the document, clearly say that
the information was not found in the uploaded document.

User question:
${message.trim() || "Summarize the uploaded document in simple words."}
`;
    }

    // Normal image/text message
    sendMessage({
      text:
        finalMessage ||
        "Please analyze this image.",
      files,
    });

    // Clear text and image
    setMessage("");
    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold">
            🎓 EduMind AI
          </h1>

          <p className="text-sm text-slate-400">
            Multimodal AI Learning Assistant
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-8">

        {/* Welcome screen */}
        {messages.length === 0 ? (
          <>
            <div className="py-10 text-center">
              <h2 className="text-3xl font-bold">
                Welcome to EduMind AI 👋
              </h2>

              <p className="mt-3 text-slate-400">
                Ask questions, learn concepts, and get help
                with your studies.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">💬</div>

                <h3 className="mt-3 text-lg font-semibold">
                  Ask Questions
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Ask EduMind AI about any educational topic.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">🖼️</div>

                <h3 className="mt-3 text-lg font-semibold">
                  Upload Images
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Analyze diagrams, questions, and study images.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">📚</div>

                <h3 className="mt-3 text-lg font-semibold">
                  RAG Knowledge
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Ask questions using your uploaded study materials.
                </p>
              </div>

            </div>
          </>
        ) : (

          /* Chat messages */
          <div className="min-h-[500px] space-y-5">

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >

                  {msg.parts.map((part, index) => {

                    // Text part
                    if (part.type === "text") {
                      return (
                        <p
                          key={index}
                          className="whitespace-pre-wrap leading-7"
                        >
                          {part.text}
                        </p>
                      );
                    }

                    // Image part
                    if (
                      part.type === "file" &&
                      part.mediaType.startsWith("image/")
                    ) {
                      return (
                        <img
                          key={index}
                          src={part.url}
                          alt={
                            part.filename ||
                            "Uploaded image"
                          }
                          className="mb-3 max-h-80 rounded-lg"
                        />
                      );
                    }

                    return null;
                  })}

                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="text-sm text-slate-400">
                EduMind AI is thinking...
              </div>
            )}

          </div>
        )}

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3"
        >

          {/* Selected image */}
          {files && files.length > 0 && (
            <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              🖼️ {files[0].name}
            </div>
          )}

          {/* Selected PDF */}
          {pdfFile && (
            <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm">

              <div className="flex items-center justify-between">

                <span className="text-slate-300">
                  📄 {pdfFile.name}
                </span>

                {pdfLoading && (
                  <span className="text-yellow-400">
                    Processing...
                  </span>
                )}

                {!pdfLoading && pdfText && (
                  <span className="text-green-400">
                    ✓ Ready
                  </span>
                )}

              </div>

              {pdfError && (
                <p className="mt-2 text-red-400">
                  {pdfError}
                </p>
              )}

            </div>
          )}

          {/* Upload buttons and text box */}
          <div className="flex gap-3">

            {/* Image file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Image button */}
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={isLoading}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xl hover:bg-slate-800 disabled:opacity-50"
              title="Upload image"
            >
              🖼️
            </button>

            {/* PDF file input */}
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfChange}
            />

            {/* PDF button */}
            <button
              type="button"
              onClick={() =>
                pdfInputRef.current?.click()
              }
              disabled={
                isLoading || pdfLoading
              }
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xl hover:bg-slate-800 disabled:opacity-50"
              title="Upload PDF"
            >
              📚
            </button>

            {/* Text input */}
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask EduMind AI anything..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                pdfLoading ||
                (
                  !message.trim() &&
                  !files?.length &&
                  !pdfText
                )
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>

          </div>
        </form>

      </div>
    </main>
  );
}