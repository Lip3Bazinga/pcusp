"use client"

import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  videoId: string
  otp: string
  playbackInfo: string
}

export default function VideoPlayer({ videoId, otp, playbackInfo }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && playerRef.current) {
      // Carregar o script do VdoCipher
      const script = document.createElement("script")
      script.src = "https://player.vdocipher.com/v2/api.js"
      script.onload = () => {
        // @ts-ignore
        new window.VdoPlayer({
          otp: otp,
          playbackInfo: playbackInfo,
          theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
          container: playerRef.current,
        })
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [otp, playbackInfo])

  return (
    <div className="w-full">
      <div ref={playerRef} className="w-full h-[400px] bg-black rounded-lg" />
    </div>
  )
}
