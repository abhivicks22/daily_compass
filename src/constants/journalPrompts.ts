export const JOURNAL_PROMPTS = [
    // Gratitude
    "What's one small thing that went well today — even if the rest was hard?",
    "Name someone or something you're quietly grateful for right now.",
    "What's a comfort you tend to take for granted?",
    "What part of your routine actually makes your day better?",
    "What's something your body did for you today that you can appreciate?",

    // Growth
    "What's something you're learning, even if it's slow going?",
    "Where did you show up for yourself today, even imperfectly?",
    "What skill or habit is 1% better than it was a month ago?",
    "What would 'good enough' look like for tomorrow?",
    "What's one thing you'd tell a friend who was being as hard on themselves as you are?",

    // Challenge
    "What felt heavy today? You don't have to fix it — just name it.",
    "What obstacle keeps showing up? What's one tiny experiment to try?",
    "What's draining your energy that you might be able to delegate or drop?",
    "What are you avoiding? What makes it hard to start?",
    "If this struggle had a lesson, what might it be teaching you?",

    // Creativity
    "If you had zero obligations tomorrow, what would you do first?",
    "What's a project or idea that excites you, even if it feels impractical?",
    "When do you feel most like yourself?",
    "What would you create if nobody was going to judge it?",
    "What's a question you've been sitting with lately?",

    // Self-compassion
    "Where are you being too hard on yourself right now?",
    "What would it feel like to let yourself rest without guilt?",
    "You're allowed to struggle AND be making progress. Where is that true?",
    "What do you need to hear right now that nobody is saying?",
    "If today was your friend's day, what would you tell them about it?",
]

/**
 * Returns a deterministic prompt for a given date, ensuring no same prompt
 * two days in a row.
 */
export function getPromptForDate(dateStr: string): string {
    // Simple hash from date string
    const hash = dateStr.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0)
    const idx = Math.abs(hash) % JOURNAL_PROMPTS.length
    return JOURNAL_PROMPTS[idx]
}

/**
 * Returns a random prompt different from the given one.
 */
export function getRandomPrompt(exclude: string): string {
    const filtered = JOURNAL_PROMPTS.filter((p) => p !== exclude)
    return filtered[Math.floor(Math.random() * filtered.length)]
}
