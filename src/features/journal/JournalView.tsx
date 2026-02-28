import { useEffect, useState, useCallback, useRef } from 'react'
import { useJournalStore } from '@/stores/useJournalStore'
import { useDayStore } from '@/stores/useDayStore'
import { getPromptForDate, getRandomPrompt } from '@/constants/journalPrompts'
import { BookOpen, Shuffle, Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { DateNavigator } from '@/components/DateNavigator'

export function JournalView() {
    const currentDate = useDayStore((s) => s.currentDate)
    const { entry, isLoading, isSaving, loadEntry, saveEntry } = useJournalStore()
    const [content, setContent] = useState('')
    const [prompt, setPrompt] = useState('')
    const [wordCount, setWordCount] = useState(0)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Load entry + set prompt for date
    useEffect(() => {
        loadEntry(currentDate)
        setPrompt(getPromptForDate(currentDate))
    }, [currentDate, loadEntry])

    // Sync local content when entry loads
    useEffect(() => {
        setContent(entry?.content || '')
    }, [entry?.date]) // eslint-disable-line react-hooks/exhaustive-deps

    // Word count
    useEffect(() => {
        const words = content.trim() ? content.trim().split(/\s+/).length : 0
        setWordCount(words)
    }, [content])

    const handleChange = useCallback(
        (value: string) => {
            setContent(value)
            saveEntry(value, prompt)
        },
        [prompt, saveEntry]
    )

    const handleShuffle = useCallback(() => {
        setPrompt(getRandomPrompt(prompt))
    }, [prompt])

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 shrink-0">
                <BookOpen size={24} className="text-[var(--color-text-primary)]" />
                <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    Journal
                </h1>
            </div>

            <DateNavigator />

            {/* Prompt Card */}
            <div className="py-6 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-medium">
                            Today's Prompt
                        </p>
                        <motion.p
                            key={prompt}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[var(--color-text-primary)] leading-relaxed"
                            style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}
                        >
                            {prompt}
                        </motion.p>
                    </div>
                    <button
                        onClick={handleShuffle}
                        className="p-2 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all shrink-0"
                        aria-label="Shuffle prompt"
                        title="Try another prompt"
                    >
                        <Shuffle size={16} />
                    </button>
                </div>
            </div>

            {/* Journal Textarea */}
            <div className="flex-1 flex flex-col min-h-[500px]">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Start writing... Let your thoughts flow freely."
                    className="w-full flex-1 py-4 text-[16px] leading-[1.8] resize-none bg-transparent focus:outline-none placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                    disabled={isLoading}
                />

                {/* Footer: Word count + Save indicator */}
                <div className="flex items-center justify-between py-4 mt-auto border-t border-[var(--color-border)] shrink-0">
                    <span className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                        {isSaving ? (
                            <>
                                <Loader2 size={12} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : content.length > 0 ? (
                            <>
                                <Check size={12} className="text-[var(--color-text-primary)]" />
                                <span className="text-[var(--color-text-primary)]">Saved</span>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {!content && !isLoading && (
                <div className="text-center py-6 text-[var(--color-text-muted)]">
                    <p className="text-sm">Your journal is a safe space. Write as little or as much as you want.</p>
                </div>
            )}
        </div>
    )
}
