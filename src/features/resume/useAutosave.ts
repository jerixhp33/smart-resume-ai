'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore } from '@/features/resume/store'
import { autosaveResume } from '@/features/resume/actions'

const DEBOUNCE_MS = 1500
const OFFLINE_STORAGE_KEY = 'smartresume_offline_draft'

export function useAutosave() {
  const { resumeId, data, resumeName, templateId, isDirty, setSaveStatus, markClean } = useResumeStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isOnlineRef = useRef(typeof navigator !== 'undefined' ? navigator.onLine : true)

  // Track online status
  useEffect(() => {
    function onOnline() {
      isOnlineRef.current = true
      // Sync offline draft if exists
      syncOfflineDraft()
    }
    function onOffline() {
      isOnlineRef.current = false
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const saveToLocalStorage = useCallback(() => {
    if (!resumeId) return
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify({
        resumeId,
        data,
        resumeName,
        templateId,
        savedAt: new Date().toISOString(),
        unsynced: true,
      }))
    } catch {
      // localStorage might be full or unavailable
    }
  }, [resumeId, data, resumeName, templateId])

  const syncOfflineDraft = useCallback(async () => {
    if (!resumeId) return
    try {
      const raw = localStorage.getItem(OFFLINE_STORAGE_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (draft.resumeId !== resumeId || !draft.unsynced) return

      setSaveStatus('saving')
      const result = await autosaveResume({
        resumeId,
        data: draft.data,
        name: draft.resumeName,
        templateId: draft.templateId,
      })

      if (result.success) {
        localStorage.removeItem(OFFLINE_STORAGE_KEY)
        markClean()
      }
    } catch {
      // Sync failed — will retry on next online event
    }
  }, [resumeId, setSaveStatus, markClean])

  const performSave = useCallback(async () => {
    if (!resumeId || !isDirty) return

    if (!isOnlineRef.current) {
      saveToLocalStorage()
      setSaveStatus('offline')
      return
    }

    setSaveStatus('saving')

    try {
      const result = await autosaveResume({
        resumeId,
        data,
        name: resumeName,
        templateId,
      })

      if (result.success) {
        // Also clear any offline draft
        localStorage.removeItem(OFFLINE_STORAGE_KEY)
        markClean()
      } else {
        // Fallback: save locally
        saveToLocalStorage()
        setSaveStatus('error')
      }
    } catch {
      saveToLocalStorage()
      setSaveStatus('error')
    }
  }, [resumeId, isDirty, data, resumeName, templateId, setSaveStatus, markClean, saveToLocalStorage])

  // Debounced autosave when data changes
  useEffect(() => {
    if (!isDirty || !resumeId) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(performSave, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isDirty, data, resumeName, templateId, resumeId, performSave])

  // Save before unload
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return
      saveToLocalStorage()
      // Force sync save attempt
      if (resumeId && isOnlineRef.current) {
        navigator.sendBeacon('/api/resumes/autosave', JSON.stringify({
          resumeId, data, name: resumeName, templateId,
        }))
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, resumeId, data, resumeName, templateId, saveToLocalStorage])

  return { performSave }
}
