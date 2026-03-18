/**
 * File: tst-config.js
 * Description: Configuration and static data for the TVCNet Social Toolkit.
 * Author: TVCNet
 * Version: 4.7.6
 */

const TST_PROV_LABEL = { 
  claude: 'Claude 3.5 Haiku', 
  openai: 'GPT-5 Nano', 
  gemini: 'Gemma 3 27B', 
  ollama: 'Ollama' 
};

const TST_PLATFORM_GUIDE = {
  twitter: { style: 'X (280-char limit): STRICT HARD LIMIT: 280 characters. Target range: 240–280 characters. Strong hook, key detail, emotional punch, CTA. 2–4 emojis.' },
  instagram: { style: 'Instagram (2,200-char limit): STRICT HARD LIMIT: 2,200 characters. Target range: 1,800–2,200 characters. Vivid story, personal insight, clear CTA. 8–12 emojis.' },
  linkedin: { style: 'LinkedIn (3,000-char limit): STRICT HARD LIMIT: 3,000 characters. Target range: 2,500–3,000 characters. Professional story, key takeaway, professional tone. 4–6 emojis.' },
  facebook: { style: 'Facebook (STRICT HARD LIMIT: 63,206 chars): Target range: 2,000–3,000 characters. Conversational story, relatable moment, clear CTA. 6–10 emojis.' },
  threads: { style: 'Threads (500-char limit): STRICT HARD LIMIT: 500 characters. Target range: 460–500 characters. Authentic and human. 3–5 emojis.' },
  tiktok: { style: 'TikTok (2,200-char limit): STRICT HARD LIMIT: 2,200 characters. Target range: 1,800–2,200 characters. Energetic voice, Gen-Z aware, 6–10 emojis.' },
  bluesky: { style: 'Bluesky (300-char limit): STRICT HARD LIMIT: 300 characters. Target range: 260–300 characters. Conversational, authentic, and tech-aware. 2–4 emojis.' }
};

const TST_HELP_CONTENT = {
  platforms: "Each platform has its own vibe! We'll adjust the style and character count to help you stand out. Platforms with a green line support 'Post Directly' functionality.",
  who: "Knowing your audience helps the AI pick the right slang and energy. Are we talking to longtime donors or first-time volunteers?",
  what: "This is your core message. If you paste a link, we'll use it for research to make your post even more accurate!",
  urlToggle: "Algorithms love native content! Uncheck this if you'd rather put the link in your first comment to boost organic reach.",
  where: "Adding a location helps with local relevance. Great for community events or regional updates!",
  why: "The 'Why' is your emotional hook. Tell us why this matters, and we'll make sure it hits home with your readers.",
  when: "Timing is everything! Use this to help the AI understand the urgency or seasonal context of your post.",
  hashtags: "A few well-chosen tags help people find your content. We'll suggest some if you leave this empty!",
  tone: "Choose the personality of your post. From 'Professional' for reports to 'Humorous' for a Friday afternoon laugh!",
  length: "Tailor the depth of your content. Choose 'Short' for punchy updates or 'Long' for detailed storytelling and threads.",
  generate: "Ready to roll? This creates your unique post using all the context we've gathered above. Magic happens here!",
  photos: "Visualize your story! AI can describe your images to help craft a more engaging post, or even suggest captions that match the image content.",
  schedule: "Plan ahead! Set a date and time to remember when each post should go live. This helps you maintain a consistent presence without the daily stress.",
  calendar: "Your content strategy at a glance. Export your schedule as a CSV to manage it in spreadsheets, or use 'Clear' to reset the view. Clearing only removes items from this local view—it does NOT delete posts already published to social platforms.",
  history: "Never lose a great idea. We save your recent generations so you can quickly jump back to a previous version and polish it further.",
  activity: "The heartbeat of the toolkit. Watch the AI think, see API statuses, and track every step of your content generation journey.",
  postDirect: "Direct posting is currently enabled for X (Twitter), LinkedIn, and Bluesky. Other platforms like Instagram and Facebook have stricter API requirements for automated posting from web tools. For these, we suggest using the 'Copy' feature and uploading manually.",
  aiProvider: "Choose your 'brain'! Each AI provider has a different personality and speed. Gemma is great for balance, Claude for creativity, and OpenAI for efficiency. local Ollama is best for 100% privacy.",
  apiKeys: "These keys allow the toolkit to talk to the AI providers on your behalf. We store them only in your browser—they never touch our servers.",
  ollama: "Ollama runs locally on your computer! Perfect for total privacy and no per-post costs, but it requires the Ollama app to be running in the background.",
  customInstructions: "Your personal 'Style Guide'. Whatever you type here becomes a mandatory rule for every post the AI generates (e.g., 'Never use more than 2 emojis').",
  backupRestore: "Safety first! Export your settings to a file so you can easily restore them on another browser or device."
};

const TST_WHIMSY = {
  empty: [
    'Your masterpiece is brewing… ☕',
    'The blank canvas awaits your brilliance ✨',
    'Feed me some W\'s and I\'ll work my magic 🪄',
    'Ready to craft something extraordinary 🚀',
    'Waiting for inspiration to strike ⚡'
  ],
  loading: [
    'Summoning the muse…',
    'Crafting brilliance…',
    'Sprinkling word dust…',
    'Channeling creativity…',
    'Mixing metaphors…',
    'Polishing prose…'
  ]
};
