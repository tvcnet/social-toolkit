/**
 * File: tst-content.js
 * Description: Content generation and polishing engine for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.11.0
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
5. READABILITY & FORMATTING:
   - SPACING: For all posts over 400 characters, you MUST use double-line breaks (\\n\\n) between all paragraphs and list items to prevent "walls of text." DO NOT use HTML tags like <br>.
   - MARKDOWN: ${platform.markdown ? 'This platform (Reddit) SUPPORTS Markdown. Use **bold** and *italics* for emphasis and structure.' : 'This platform (Facebook, Instagram, X, Threads, etc.) DOES NOT supported Markdown. STRICT PROHIBITION against using asterisks (**) or underscores (_) for formatting. Instead, use CAPITALIZATION for emphasis and bullet points (•) for lists.'}
6. NO HALLUCINATIONS: Do not invent links or details not present in the details above.
7. NO META-DATA / FOOTERS: STRICT PROHIBITION against including dates, times, or 'Published by' strings at the end of the post (e.g., "Published March 21, 2026"). Output only the story content itself.
`.trim();
  },

  async polish(text, limit, context) {
    const { aiProv, keys, ollamaUrl, ollamaModel, includeUrl } = context;
    const targetLimit = Math.max(10, limit - 25); // Ask AI to aim lower to account for hallucinated counting
    
    const p = `STRICT TASK: You are a strict character-limit enforcer. Truncate the following social media post to be ABSOLUTELY UNDER ${targetLimit} characters.
It is currently ${text.length} characters.
CRITICAL: You MUST aggressively shorten the text. If you fail to make it under ${targetLimit} characters, the system will break.
${includeUrl ? 'You MUST preserve the full URL, which takes up character space. Shorten the TEXT heavily to compensate.' : 'CRITICAL: Do NOT include any URLs or link placeholders.'}
Remove fluff, adjectives, greeting phrases, and extra emojis. CRITICAL: Preserve double-line breaks between paragraphs for readability—do not collapse into a single block. DO NOT use HTML tags like <br>.
    DO NOT add any intro text or meta-labels. JUST OUTPUT THE REVISED POST.

POST TO TRIM:
${text}`;
    
    const txt = await TST_AIService.call(aiProv, p, keys, { ollamaUrl, ollamaModel });
    return txt.trim();
  },

  /**
   * Consolidated post-processing pipeline.
   * Strips markdown on non-markdown platforms, removes links if disabled,
   * and normalizes any literal \n sequences.
   */
  postProcess(text, platform, options = {}) {
    let result = text;
    if (platform && !platform.markdown) {
      result = TST_Utils.stripMarkdown(result);
    }
    if (!options.includeUrl) {
      result = TST_Utils.stripLinks(result);
    }
    // Normalize HTML breaks
    result = result.replace(/<br\s*\/?>/gi, '\n');
    
    // Normalize any literal \n sequences into actual newlines
    result = result.replace(/\\n/g, '\n');

    // Collapse excessive line breaks (max 2 consecutive allowed)
    result = result.replace(/\n{3,}/g, '\n\n');
    
    return result.trim();
  }
};
