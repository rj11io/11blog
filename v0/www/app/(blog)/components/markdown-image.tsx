"use client"

import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { useState, type WheelEvent } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

export function MarkdownImage({ src, alt }: { src: string; alt?: string }) {
  const [zoom, setZoom] = useState(1)

  function changeZoom(amount: number) {
    setZoom((currentZoom) => clampZoom(currentZoom + amount))
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    changeZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
  }

  function handlePreviewClick() {
    setZoom((currentZoom) => (currentZoom < 2 ? 2 : 1))
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setZoom(1)
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Open image fullscreen${alt ? `: ${alt}` : ""}`}
          className="group relative block w-full cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt ?? ""}
            className="h-auto w-full object-cover transition-opacity group-hover:opacity-90"
          />
          <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-background/80 p-2 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Open fullscreen</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="flex h-[calc(100vh-1.5rem)] max-w-[calc(100vw-1.5rem)] flex-col gap-3 overflow-hidden border-white/10 bg-black/95 p-3 text-white shadow-2xl sm:h-[calc(100vh-3rem)] sm:max-w-[calc(100vw-3rem)]"
      >
        <DialogTitle className="sr-only">{alt || "Image preview"}</DialogTitle>
        <DialogDescription className="sr-only">
          Fullscreen image preview. Use the controls or mouse wheel to zoom.
        </DialogDescription>

        <div
          className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg bg-black/40 p-2 sm:p-4"
          onWheel={handleWheel}
        >
          <div className="flex min-h-full min-w-full items-center justify-center">
            <button
              type="button"
              onClick={handlePreviewClick}
              aria-label={zoom < 2 ? "Zoom image in" : "Reset image zoom"}
              className={`border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${zoom < 2 ? "cursor-zoom-in" : "cursor-zoom-out"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt ?? ""}
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-4rem)] object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                }}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => changeZoom(-ZOOM_STEP)}
            disabled={zoom === MIN_ZOOM}
            aria-label="Zoom out"
            className="cursor-zoom-out rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
            className="min-w-14 rounded-md px-2 py-1 text-center text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => changeZoom(ZOOM_STEP)}
            disabled={zoom === MAX_ZOOM}
            aria-label="Zoom in"
            className="cursor-zoom-in rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
            className="ml-2 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
