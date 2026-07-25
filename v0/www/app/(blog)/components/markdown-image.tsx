"use client"

import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const CONTROL_ZOOM_STEP = 0.1
const WHEEL_ZOOM_SENSITIVITY = 0.0015
const MAX_WHEEL_DELTA = 100

type ViewState = {
  zoom: number
  offsetX: number
  offsetY: number
}

const INITIAL_VIEW: ViewState = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
}

type ZoomAnchor = {
  clientX: number
  clientY: number
}

type DragState = {
  pointerId: number
  startClientX: number
  startClientY: number
  startView: ViewState
  imageRect: DOMRect
  viewportRect: DOMRect
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

function zoomViewAt(
  currentView: ViewState,
  requestedZoom: number,
  imageRect?: DOMRect,
  anchor?: ZoomAnchor
) {
  const zoom = clampZoom(requestedZoom)

  if (zoom === currentView.zoom) return currentView
  if (!imageRect) return { ...currentView, zoom }

  const clientX = anchor?.clientX ?? imageRect.left + imageRect.width / 2
  const clientY = anchor?.clientY ?? imageRect.top + imageRect.height / 2
  const zoomRatio = zoom / currentView.zoom

  return {
    zoom,
    offsetX: currentView.offsetX + (1 - zoomRatio) * (clientX - imageRect.left),
    offsetY: currentView.offsetY + (1 - zoomRatio) * (clientY - imageRect.top),
  }
}

function normalizeWheelDelta(event: WheelEvent, viewportHeight: number) {
  const delta =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? event.deltaY * 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? event.deltaY * viewportHeight
        : event.deltaY

  return Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, delta))
}

function panAxis(
  currentOffset: number,
  delta: number,
  imageStart: number,
  imageSize: number,
  viewportStart: number,
  viewportSize: number
) {
  if (imageSize <= viewportSize) {
    const centeredStart = viewportStart + (viewportSize - imageSize) / 2
    return currentOffset + centeredStart - imageStart
  }

  const minDelta = viewportStart + viewportSize - (imageStart + imageSize)
  const maxDelta = viewportStart - imageStart
  const clampedDelta = Math.max(minDelta, Math.min(maxDelta, delta))

  return currentOffset + clampedDelta
}

function panView(drag: DragState, clientX: number, clientY: number): ViewState {
  return {
    ...drag.startView,
    offsetX: panAxis(
      drag.startView.offsetX,
      clientX - drag.startClientX,
      drag.imageRect.left,
      drag.imageRect.width,
      drag.viewportRect.left,
      drag.viewportRect.width
    ),
    offsetY: panAxis(
      drag.startView.offsetY,
      clientY - drag.startClientY,
      drag.imageRect.top,
      drag.imageRect.height,
      drag.viewportRect.top,
      drag.viewportRect.height
    ),
  }
}

export function MarkdownImage({ src, alt }: { src: string; alt?: string }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [zoomViewport, setZoomViewport] = useState<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [view, setView] = useState(INITIAL_VIEW)

  useEffect(() => {
    if (!zoomViewport) return
    const viewport = zoomViewport

    function handleWheel(event: WheelEvent) {
      event.preventDefault()

      const imageRect = imageRef.current?.getBoundingClientRect()
      const delta = normalizeWheelDelta(event, viewport.clientHeight)
      const zoomFactor = Math.exp(-delta * WHEEL_ZOOM_SENSITIVITY)

      setView((currentView) =>
        zoomViewAt(currentView, currentView.zoom * zoomFactor, imageRect, event)
      )
    }

    viewport.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      viewport.removeEventListener("wheel", handleWheel)
    }
  }, [zoomViewport])

  function resetView() {
    dragRef.current = null
    setIsDragging(false)
    setView(INITIAL_VIEW)
  }

  function setZoomAt(requestedZoom: number, anchor?: ZoomAnchor) {
    const imageRect = imageRef.current?.getBoundingClientRect()

    setView((currentView) =>
      zoomViewAt(currentView, requestedZoom, imageRect, anchor)
    )
  }

  function changeZoom(amount: number, anchor?: ZoomAnchor) {
    setZoomAt(view.zoom + amount, anchor)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || view.zoom <= 1 || dragRef.current) return

    const imageRect = imageRef.current?.getBoundingClientRect()
    if (!imageRect) return

    const viewportRect = event.currentTarget.getBoundingClientRect()
    const canPan =
      imageRect.width > viewportRect.width ||
      imageRect.height > viewportRect.height

    if (!canPan) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startView: view,
      imageRect,
      viewportRect,
    }
    setIsDragging(true)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    event.preventDefault()
    setView(panView(drag, event.clientX, event.clientY))
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setIsDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) resetView()
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
          Fullscreen image preview. Use the controls or mouse wheel to zoom,
          then drag to move around the image.
        </DialogDescription>

        <div
          ref={setZoomViewport}
          className={`flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden rounded-lg bg-black/40 p-2 select-none sm:p-4 ${view.zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onLostPointerCapture={handlePointerEnd}
        >
          <div className="flex min-h-full min-w-full items-center justify-center">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={src}
                alt={alt ?? ""}
                draggable={false}
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-4rem)] object-contain will-change-transform"
                style={{
                  transform: `translate3d(${view.offsetX}px, ${view.offsetY}px, 0) scale(${view.zoom})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => changeZoom(-CONTROL_ZOOM_STEP)}
            disabled={view.zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="cursor-zoom-out rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset zoom"
            className="min-w-14 rounded-md px-2 py-1 text-center text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            {Math.round(view.zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => changeZoom(CONTROL_ZOOM_STEP)}
            disabled={view.zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="cursor-zoom-in rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={resetView}
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
