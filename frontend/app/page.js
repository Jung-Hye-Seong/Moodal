"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

const themes = {
  0: {
    main: "#FF6B81",
    secondary: "#FFB3C1",
    third: "#FFF1F3",
    text: "#4A1F28"
  },

  1: {
    main: "#FF9F43",
    secondary: "#FFD0A6",
    third: "#FFF4EA",
    text: "#5A3412"
  },

  2: {
    main: "#FFD93D",
    secondary: "#FFF0A6",
    third: "#FFFBEA",
    text: "#5C4B00"
  },

  3: {
    main: "#4CD97B",
    secondary: "#B8F2CC",
    third: "#F1FFF5",
    text: "#1D4D32"
  },

  4: {
    main: "#4DA8FF",
    secondary: "#B9E0FF",
    third: "#EEF7FF",
    text: "#183B56"
  },

  5: {
    main: "#A97CFF",
    secondary: "#DCCBFF",
    third: "#F5F1FF",
    text: "#35204F"
  },

  6: {
    main: "#2F2F36",
    secondary: "#555561",
    third: "#7A7A88",
    text: "#F8F8F8"
  },

  7: {
    main: "#FFFFFF",
    secondary: "#F3F3F3",
    third: "#EBEBEB",
    text: "#111111"
  }
};

export default function Home() {
  const audioRef = useRef(null);

  const [startedAudio, setStartedAudio] = useState(false);

  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState([]);

  const [theme, setTheme] = useState(themes[4]);

  useEffect(() => {
    const tracks = [
      "/calm1.mp3",
      "/calm2.mp3",
      "/calm3.mp3",
      "/calm4.mp3",
      "/calm5.mp3",
      "/calm6.mp3",
      "/calm7.mp3",
      "/calm8.mp3",
      "/calm9.mp3"
    ];

    function getRandomTrack(currentSrc = "") {
      let nextTrack;

      do {
        nextTrack =
          tracks[
            Math.floor(Math.random() * tracks.length)
          ];
      }

      while (
        currentSrc.includes(nextTrack)
      );

      return nextTrack;
    }

    const audio = new Audio(
      getRandomTrack()
    );

    audio.volume = 0.3;

    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      const nextTrack = getRandomTrack(
        audio.src
      );

      audio.src = nextTrack;

      audio.play();
    });

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    async function loadMemory() {
      try {
        const res = await fetch(
          "https://moodal.vercel.app/call-memory"
        );

        const data = await res.json();

        if (Array.isArray(data.temMemory)) {

          const formatted = data.temMemory.flatMap((item) => [
            {
              role: "user",
              content: item.user
            },

            {
              role: "ai",
              content: item.ai
            }
          ]);

          setMessages(formatted);
        }

      } catch (err) {
        console.error(err);
      }
    }

    loadMemory();
  }, []);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    if (!startedAudio && audioRef.current) {
      audioRef.current.play();

      setStartedAudio(true);
    }

    const currentPrompt = prompt;

    setMessages((prev) => [
      ...prev,

      {
        role: "user",
        content: currentPrompt
      }
    ]);

    setPrompt("");

    const res = await fetch(
      "https://moodal.vercel.app/get-response",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: currentPrompt
        }),
      }
    );

    const data = await res.json();

    const colorCode = Number(data.colorCode);

    if (themes[colorCode]) {
      setTheme(themes[colorCode]);
    }

    setMessages((prev) => [
      ...prev,

      {
        role: "ai",
        content: data.response
      }
    ]);
  }

  return (
    <div
      className="app"
      style={{
        background: theme.third,
        color: theme.text
      }}
    >
      <header
        className="header"
        style={{
          background: theme.third,
          borderColor: theme.secondary
        }}
      >
        <div className="logo">
          Moodal
        </div>
      </header>

      <div className="layout">

        <aside
          className="sidebar"
          style={{
            background: theme.secondary,
            borderColor: theme.main
          }}
        >
          <div className="sidebar-title">
            Conversations
          </div>
        </aside>

        <main className="chat-wrapper">

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role}`}
                style={{
                  background:
                    msg.role === "user"
                      ? theme.main
                      : "#FFFFFF",

                  color: theme.text,

                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div
            className="chat-input-container"
            style={{
              background: "#FFFFFF",
              borderColor: theme.secondary
            }}
          >
            <textarea
              placeholder="Message Moodal..."
              value={prompt}

              onChange={(e) => {
                setPrompt(e.target.value);

                e.target.style.height = "auto";

                e.target.style.height =
                  `${e.target.scrollHeight}px`;
              }}

              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  handleSubmit();

                  e.target.style.height = "auto";
                }
              }}

              rows={1}
            />

            <button
              onClick={handleSubmit}
              style={{
                background: theme.main,
                color: theme.text
              }}
            >
              Send
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
