export const compassionPrompts: string[] = [
    "What would you say to a friend who had the day you just had?",
    "Name one thing you did today that took courage, even a small one.",
    "Rest is not laziness. What rest did your body or mind need today?",
    "Progress isn't always visible. What invisible growth happened today?",
    "You showed up today. That counts. What made showing up possible?",
    "What's one kind thing you can do for yourself right now?",
    "Difficulty isn't failure — it's information. What did today teach you?",
    "Some days are for surviving, not thriving. Which was today, and that's okay either way.",
    "What's one thing you're grateful for, even if the day was hard?",
    "You don't have to earn rest. How will you rest tonight?",
    "Perfection is the enemy of progress. Where did 'good enough' serve you today?",
    "What part of today would you like to carry into tomorrow?",
    "Your worth isn't measured by your productivity. What made you feel human today?",
    "What boundary did you hold or wish you had held today?",
    "Small steps still move you forward. What small step did you take?",
    "It's okay to not be okay. How are you really feeling right now?",
    "What's something you learned about yourself today?",
    "Comparison steals joy. What's YOUR win today, regardless of anyone else?",
    "You are more than your to-do list. What brought you joy today?",
    "Tomorrow is a fresh start. What's one thing you want to try differently?",
    "Energy fluctuates — that's human, not weakness. How was your energy today?",
    "What's one thing you can let go of from today?",
    "You made it through today. That alone deserves acknowledgment.",
    "What surprised you about today?",
    "If today were a chapter title, what would it be?",
    "What's one thing you did today that past-you would be proud of?",
    "Stress is a signal, not a sentence. What was your body telling you today?",
    "What's something you want to remember about today?",
    "You're allowed to change your mind. What opinion shifted today?",
    "Every expert was once a beginner. Where are you still learning, and that's great?",
]

export function getPromptForDate(dateStr: string): string {
    // Use the date string to deterministically pick a prompt
    // This ensures the same date always gets the same prompt,
    // and consecutive days get different prompts
    const dateNum = dateStr.split('-').join('')
    const idx = parseInt(dateNum, 10) % compassionPrompts.length
    return compassionPrompts[idx]
}
