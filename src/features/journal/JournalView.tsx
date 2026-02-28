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
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BookOpen size={28} className="text-[var(--color-blue)]" />
                <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Journal
                </h1>
            </div>

            <DateNavigator />

            {/* Prompt Card */}
            <div className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
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
                        className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-blue)] transition-all shrink-0"
                        aria-label="Shuffle prompt"
                        title="Try another prompt"
                    >
                        <Shuffle size={18} />
                    </button>
                </div>
            </div>

            {/* Journal Textarea */}
            <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Start writing... Let your thoughts flow freely."
                    className="w-full p-5 text-sm leading-relaxed resize-none bg-transparent focus:outline-none"
                    style={{ minHeight: '320px', fontFamily: 'var(--font-body)' }}
                    disabled={isLoading}
                />

                {/* Footer: Word count + Save indicator */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-light)] bg-[var(--color-paper)]">
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px]">
                        {isSaving ? (
                            <>
                                <Loader2 size={12} className="animate-spin text-[var(--color-text-muted)]" />
                                <span className="text-[var(--color-text-muted)]">Saving...</span>
                            </>
                        ) : content.length > 0 ? (
                            <>
                                <Check size={12} className="text-[var(--color-green)]" />
                                <span className="text-[var(--color-green)]">Saved</span>
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
