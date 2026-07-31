"use client"

import * as React from "react"

export type ViewMode = "list" | "cards"

const STORAGE_KEY = "11blog:view-mode"
const DEFAULT_VIEW_MODE: ViewMode = "cards"

function isViewMode(value: string | null): value is ViewMode {
  return value === "list" || value === "cards"
}

/**
 * One value for the whole app, held here rather than in each component's state.
 * Every browser on the page reads the same store, so switching layout in one
 * place is reflected everywhere immediately. The storage event alone would not
 * do that: browsers only fire it in *other* tabs.
 */
let current: ViewMode | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function read(): ViewMode {
  if (current !== null) return current
  if (typeof window === "undefined") return DEFAULT_VIEW_MODE

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    current = isViewMode(stored) ? stored : DEFAULT_VIEW_MODE
  } catch {
    // Reading throws when storage is blocked outright. Fall back rather than
    // taking the page down over a layout preference.
    current = DEFAULT_VIEW_MODE
  }

  return current
}

function write(next: ViewMode) {
  current = next

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Private browsing and a full quota both throw on write. The choice still
    // applies for this session; it just will not be remembered.
  }

  emit()
}

function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return

  // A null newValue means the key was removed, which lands on the default.
  current = isViewMode(event.newValue) ? event.newValue : DEFAULT_VIEW_MODE
  emit()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage)
    }
  }
}

/**
 * The reader's list-or-cards choice, remembered across pages and tabs.
 *
 * The third argument is what the server renders and what hydration matches
 * against, so it is always the default. React reads the real value straight
 * after hydrating and re-renders if it differs, which is why a stored choice of
 * list can briefly show as cards on first paint. See the note in the rendering
 * post: the pages are static, so the server cannot know the preference.
 */
export function useViewMode() {
  const viewMode = React.useSyncExternalStore(
    subscribe,
    read,
    () => DEFAULT_VIEW_MODE
  )

  return [viewMode, write] as const
}
