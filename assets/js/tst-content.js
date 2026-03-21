/**
 * File: tst-content.js
 * Description: Content generation and polishing engine for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.7.8
 */

const TST_ContentEngine = {
  buildPrompt(data) {
    const { selectedPlatform: platform, who, what, where, why, whenDate, whenTime, hashtags, tone, contentLength, customInstructions, includeUrl, photos } = data;
    
    if (!platform) return 'Write a general post based on these details:';
    
    const lenLabel = ['CONCISE', 'BALANCED', 'DEEP DIVE'][contentLength - 1];
    const when = whenDate ? new Date(whenDate + 'T12:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + (whenTime ? ' at ' + whenTime : '') : '';
    const guide = TST_PLATFORM_GUIDE[platform.key] || { style: 'Professional and engaging social media post.' };
    const imgInstruction = photos && photos.length > 0 ? '\nIMAGE CONTEXT:\nI have attached images to this prompt. Please analyze them and incorporate relevant visual details into the post to make it more engaging.\n' : '';

    return `You are a world-class social media copywriter who specializes in writing ${lenLabel} posts.
${customInstructions ? '\nUSER STYLE GUIDE:\n' + customInstructions + '\n' : ''}${imgInstruction}
STORY DETAILS (5 W's):
${who ? '• WHO: ' + who : ''}
${what ? (includeUrl ? '• WHAT (INC URL): ' : '• WHAT (CONTEXT ONLY - NO URL ALLOWED): ') + what : ''}
${where ? '• WHERE: ' + where : ''}
${why ? '• WHY: ' + why : ''}
${when ? '• WHEN: ' + when : ''}
${hashtags ? '• HASHTAGS: ' + hashtags : ''}

TONE: ${tone}

PLATFORM REQUIREMENTS:
${guide.style}

CRITICAL RULES (FOLLOW IN ORDER):
1. URL INTEGRITY: ${includeUrl ? 'You MUST include the full original URL from "WHAT" at the end of the post. No bit.ly. No shortening.' : 'STRICT PROHIBITION: Do NOT include ANY links, URLs, or any text referring to a link (e.g., "Read more here", "Link below", "[URL]", "[Link]"). The URL in "WHAT" is for your internal research only.'}
2. NO SHORTENERS: Never use bit.ly, tinyurl, or any other shortener. Use original text or original full URL.
3. CHARACTER LIMIT: YOUR POST MUST BE UNDER THE LIMIT. If a URL is included, shorten your TEXT significantly to compensate.
4. Output ONLY the final post text. No labels, no headers.
5. PLAIN TEXT ONLY: No markdown formatting. Do NOT use asterisks for bold (**text**) or underscores for italics (_text_). Use ONLY standard alphanumeric characters, punctuation, and emojis.
6. NO HALLUCINATIONS: Do not invent links or details not present in the details above.
`.trim();
  },

  async polish(text, limit, context) {
    const { aiProv, keys, ollamaUrl, ollamaModel, includeUrl } = context;
    
    const p = `STRICT TASK: Truncate the following social media post to be UNDER ${limit} characters.
It is currently ${text.length} characters.
CRITICAL: You MUST be at least 5-10 characters UNDER the limit of ${limit} to ensure 100% compliance.
${includeUrl ? 'You MUST preserve the full URL.' : 'CRITICAL: Do NOT include any URLs or link placeholders.'}
Remove fluff, adjectives, greeting phrases, and extra emojis.
    DO NOT add any intro text or meta-labels. JUST OUTPUT THE REVISED POST (PLAIN TEXT ONLY - NO MARKDOWN).

POST TO TRIM:
${text}`;
    
    let txt = '';
    if (aiProv === 'claude') txt = await TST_AIService.callClaude(p, keys.anthropic);
    else if (aiProv === 'openai') txt = await TST_AIService.callOpenAI(p, keys.openai);
    else if (aiProv === 'gemini') txt = await TST_AIService.callGemini(p, keys.google);
    else if (aiProv === 'ollama') txt = await TST_AIService.callOllama(p, ollamaUrl, ollamaModel);
    
    return txt.trim();
  }
};
