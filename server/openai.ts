import OpenAI from "openai"

let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI {
    if (!_openai) {
        _openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        })
    }
    return _openai
}
