import type { Module } from './types';

export const modules: Module[] = [
  {
    id: 'mindset',
    number: '01',
    title: 'The AI Mindset for',
    titleEm: 'Designers',
    tagline:
      'Lose the fear. Frame AI as your assistant, not your replacement, and find where it actually fits inside the way you already work.',
    duration: '~25 min',
    tools: ['Conceptual'],
    interactive: null,
    lessons: [
      {
        id: 'what-ai-is',
        title: 'What AI actually is — in plain language',
        sections: [
          {
            type: 'paragraph',
            content:
              'AI is a tool that learns patterns from millions of existing designs and uses those patterns to generate ideas, visuals, and decisions on demand. It does not understand a brief the way you do. It does not have taste. It generates options — many of them, very fast. Your job is to choose well.',
          },
          {
            type: 'callout',
            content: 'AI gives you options. Designers choose the best one.',
          },
          {
            type: 'paragraph',
            content:
              'That single sentence is the foundation of this entire course. Internalise it. Repeat it to clients. The shift in mindset, from <em>maker</em> to <em>curator with leverage</em>, is what separates designers who get faster and better from designers who get replaced.',
          },
        ],
      },
      {
        id: 'can-cant',
        title: 'What AI can do — and what it cannot',
        sections: [
          { type: 'heading', content: 'AI can' },
          {
            type: 'list',
            content: [
              'Generate dozens of concepts in minutes from a short prompt',
              'Produce convincing visuals — moodboard fragments, room renders, palette explorations',
              'Speed up repetitive tasks: cropping, captioning, palette extraction, format conversion',
              'Suggest layouts, furniture combinations, and styling permutations to test',
            ],
          },
          { type: 'heading', content: 'AI cannot' },
          {
            type: 'list',
            content: [
              "Understand a client's emotions, family rhythm, or unspoken expectations",
              'Replace taste, instinct, restraint, or experience',
              'Make the final call on what is actually right for a space',
              'Take responsibility when something is wrong — only you can do that',
            ],
          },
        ],
      },
      {
        id: 'new-role',
        title: 'The new role of the designer',
        sections: [
          {
            type: 'paragraph',
            content:
              'Pre-AI, your value was largely <em>making</em> — drafting concepts, hand-rendering moods, sourcing references one Pinterest tab at a time. Post-AI, your value is <em>curating</em>: choosing the right idea, holding the line on quality, translating a feeling into a brief the client can sign off on.',
            },
          {
            type: 'paragraph',
            content:
              'This is good news. The work that always mattered most — judgement, taste, client trust — is precisely the work that AI cannot do. Everything else is now lighter.',
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Identify three slow steps in your current workflow.',
      guidance:
        'Open your last project. List three steps where you waited, redid work, or got stuck. Those are your AI candidates — we will return to this list throughout the course.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the single sentence that defines the right mindset toward AI in this course?',
        options: [
          'AI replaces all repetitive design work.',
          'AI gives you options. Designers choose the best one.',
          'AI is the future, designers are the past.',
          'AI is most useful for sourcing furniture.',
        ],
        correctIndex: 1,
        explanation:
          'AI generates options, fast and at scale. Choosing well — the part that takes taste — is still the designer\'s job.',
      },
      {
        id: 'q2',
        question: 'Which of the following is something AI cannot reliably do?',
        options: [
          'Generate ten room concepts before lunch.',
          'Suggest furniture layouts to test.',
          'Understand a client\'s emotions and unspoken expectations.',
          'Crop and reformat images for a presentation.',
        ],
        correctIndex: 2,
        explanation:
          'Emotional intelligence and reading subtext are designer skills. AI can speed up the visible work, not the human work.',
      },
      {
        id: 'q3',
        question: 'How does the course describe the new role of the designer?',
        options: [
          'A maker, building everything from scratch.',
          'A technician, debugging AI tools.',
          'A curator with leverage, choosing among many AI-generated options.',
          'A researcher, gathering references full-time.',
        ],
        correctIndex: 2,
        explanation:
          'The shift from maker to curator is the central reframe. AI handles volume; you handle judgement.',
      },
    ],
  },
  {
    id: 'concepts',
    number: '02',
    title: 'AI for Concept',
    titleEm: 'Creation',
    tagline:
      'Master the prompt formula that produces client-ready concepts in any style. Generate four directions before your second coffee.',
    duration: '~40 min',
    tools: ['Midjourney', 'DALL·E'],
    interactive: 'prompt-builder',
    lessons: [
      {
        id: 'prompt-formula',
        title: 'The prompt formula that always works',
        sections: [
          {
            type: 'paragraph',
            content:
              'The single most-asked question in AI design tools is "why are my prompts giving bad results?" The answer is almost always: not enough structure. A good prompt has five parts, in this order:',
          },
          {
            type: 'callout',
            content: 'Style + Room + Materials + Lighting + Mood',
          },
          {
            type: 'paragraph',
            content:
              'A worked example: <em>"modern luxury living room, beige tones, marble and walnut, soft afternoon light, calm and refined."</em> Five elements, one comma between each. The image will land far closer to your intent than any single-keyword prompt ever does.',
          },
          {
            type: 'paragraph',
            content:
              'In the <strong>Try It</strong> tab, you will find an interactive prompt builder. Pick your variables and the tool generates eight unique variations instantly. Copy the ones you like into Midjourney or DALL·E to render.',
          },
        ],
      },
      {
        id: 'variations',
        title: 'Always generate variations — never settle on one',
        sections: [
          {
            type: 'paragraph',
            content:
              'A common mistake is to write one prompt, generate one image, and either accept it or scrap it. Generate four to eight per concept. The fourth is almost always better than the first. The eighth is sometimes spectacular.',
          },
          {
            type: 'list',
            content: [
              'Run the same prompt with different lighting and mood combinations',
              'Try the same scene in three different styles to see which fits the brief',
              'Vary the materials list once you find a composition you like',
              'Save every result you might use, not just the one you love now',
            ],
          },
        ],
      },
      {
        id: 'refining',
        title: 'Refining a result you almost like',
        sections: [
          {
            type: 'paragraph',
            content:
              'When you get a result that is close but not right, do not rewrite the entire prompt. Make one targeted change and re-render. This is how professionals iterate.',
          },
          {
            type: 'list',
            content: [
              'Too cluttered? Add "minimal, uncluttered, negative space"',
              'Wrong mood? Swap one mood word — "calm" to "bold" changes everything',
              'Material feels off? Replace one material, leave the rest',
              'Lighting flat? Try "golden hour" or "dramatic side lighting"',
            ],
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Generate three concepts: one luxury living room, one modern bedroom, one bold maximalist space.',
      guidance:
        'Use the Try It tab to build prompts for each. For the bold concept, pick variables you would not normally choose. Save the prompts you like — these become your library for the next real client brief.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'What are the five elements of the prompt formula taught in this module?',
        options: [
          'Color, Furniture, Layout, Style, Era',
          'Style, Room, Materials, Lighting, Mood',
          'Brand, Budget, Brief, Build, Bill',
          'Modern, Classic, Minimal, Luxury, Bold',
        ],
        correctIndex: 1,
        explanation:
          'Style + Room + Materials + Lighting + Mood. Five elements, separated by commas. This is the backbone of every prompt in the course.',
      },
      {
        id: 'q2',
        question: 'How many variations should you generate per concept, ideally?',
        options: [
          'Just one — be decisive.',
          'Two — original and a backup.',
          'Four to eight — the later ones are often better.',
          'Twenty or more — quantity over everything.',
        ],
        correctIndex: 2,
        explanation:
          'Four to eight gives you real choice without diminishing returns. The fourth is often better than the first, the eighth sometimes outstanding.',
      },
      {
        id: 'q3',
        question: 'When refining a result that is close but not right, what is the recommended approach?',
        options: [
          'Rewrite the entire prompt from scratch.',
          'Make one targeted change and re-render.',
          'Generate twenty more variations and pick blind.',
          'Switch tools.',
        ],
        correctIndex: 1,
        explanation:
          'Targeted iteration. Change one variable at a time so you actually learn what each lever does to the result.',
      },
    ],
  },
  {
    id: 'moodboards',
    number: '03',
    title: 'Moodboards &',
    titleEm: 'Palettes',
    tagline:
      'Turn AI outputs into client-ready presentations. Generate harmonious color palettes computationally, justify them in design language.',
    duration: '~35 min',
    tools: ['Canva', 'Color Theory'],
    interactive: 'palette-builder',
    lessons: [
      {
        id: 'building-board',
        title: 'What a moodboard actually communicates',
        sections: [
          {
            type: 'paragraph',
            content:
              'A moodboard is not a collage. It is an argument — a visual case for why a particular feeling is right for this client, in this space, at this moment. Every element should defend that argument.',
          },
          {
            type: 'list',
            content: [
              'One AI-generated hero image that sets the emotional tone',
              'A five-color palette anchoring the materials',
              'Three to five physical material references (stone, wood, fabric)',
              'A typographic mark — the project name, set well',
              'No more than that. Restraint is the entire point.',
            ],
          },
        ],
      },
      {
        id: 'palette-theory',
        title: 'Color palettes — the part most designers fake',
        sections: [
          {
            type: 'paragraph',
            content:
              'Most palettes are picked by eye. That works until it does not. The <strong>Try It</strong> tab generates computationally harmonious palettes from color theory: analogous, complementary, triadic, split-complementary, and monochromatic. Each comes with an explanation you can paste straight into a client deck.',
          },
          {
            type: 'callout',
            content: 'A palette you can defend is a palette the client trusts.',
          },
        ],
      },
      {
        id: 'storytelling',
        title: 'Storytelling — how to present, not describe',
        sections: [
          {
            type: 'paragraph',
            content:
              'The difference between a junior and senior presentation is one word: <em>describe</em> vs <em>argue</em>. A junior says, "this is the living room palette." A senior says, "this palette holds the room together when the afternoon sun shifts — warm enough to feel alive, restrained enough to read as luxury."',
          },
          {
            type: 'paragraph',
            content:
              'Practice writing one sentence per slide that defends the choice. The deck should still make sense if a client reads only the captions.',
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Generate three palettes for a single brief: a calm warm bedroom for a young couple in Dubai.',
      guidance:
        'Use the Try It tab. Generate a warm analogous palette, a bold split-complementary palette, and a neutral monochrome palette. Write one defensive sentence for each — the kind you would say to the client.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'According to the module, what is a moodboard, fundamentally?',
        options: [
          'A collection of pretty images.',
          'A Pinterest export.',
          'A visual argument defending a feeling for a specific space.',
          'A catalog of materials.',
        ],
        correctIndex: 2,
        explanation:
          'A moodboard is an argument — every element justifies the proposed direction. That framing changes how you build them.',
      },
      {
        id: 'q2',
        question: 'How many colors should a working interior palette typically contain?',
        options: [
          'Two.',
          'Three.',
          'Five.',
          'Eight or more.',
        ],
        correctIndex: 2,
        explanation:
          'Five is the sweet spot — usually one anchor, one accent, and three supporting tones. Enough range to dress a whole room, restrained enough to stay coherent.',
      },
      {
        id: 'q3',
        question: 'What separates a junior presentation from a senior one?',
        options: [
          'Better fonts.',
          'More slides.',
          'The senior argues for choices, the junior just describes them.',
          'The senior uses more AI.',
        ],
        correctIndex: 2,
        explanation:
          'Argue, do not describe. Every choice should come with the reason behind it, in plain client language.',
      },
    ],
  },
  {
    id: 'planning',
    number: '04',
    title: 'Space Planning',
    titleEm: 'with AI',
    tagline:
      'Use AI to test layout options instantly. Learn the principles AI does not know — flow, focal points, the math of negative space.',
    duration: '~30 min',
    tools: ['Planner 5D', 'Homestyler'],
    interactive: null,
    lessons: [
      {
        id: 'principles',
        title: 'The four principles AI does not know',
        sections: [
          {
            type: 'paragraph',
            content:
              'AI tools can suggest layouts. They cannot tell you why a layout works. Hold these four principles in your head whenever you accept or override an AI suggestion.',
          },
          {
            type: 'list',
            content: [
              '<strong>Function over aesthetics</strong> — the room must work before it can look good',
              '<strong>Flow of movement</strong> — people walk in lines, not zigzags. Honour the lines.',
              '<strong>Focal points</strong> — every room needs one anchor the eye returns to',
              '<strong>Balance</strong> — visual weight, not symmetry. They are different.',
            ],
          },
        ],
      },
      {
        id: 'common-mistakes',
        title: 'Common AI layout mistakes — and how to spot them',
        sections: [
          {
            type: 'list',
            content: [
              'Oversized furniture for the room footprint — always cross-check dimensions',
              'Poor circulation — at least 90cm between major furniture pieces',
              'No focal point — AI loves to fill space evenly, which kills tension',
              'Symmetry mistaken for balance — they look similar, they are not the same',
            ],
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Plan a living room layout twice. Test two arrangements. Justify which one you would send to a client.',
      guidance:
        'Use Planner 5D or Homestyler. For each arrangement, write down what the focal point is, where people walk, and which feels balanced. Then choose — and write the one-line reason in the language you would say it to the client.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'Which of these is one of the four planning principles AI does not know?',
        options: [
          'The Fibonacci sequence.',
          'Balance — visual weight, not symmetry.',
          'Always face furniture toward windows.',
          'Use only odd numbers of items.',
        ],
        correctIndex: 1,
        explanation:
          'Balance is about visual weight. Symmetry is one tool for achieving it, but not the only one — and AI often confuses the two.',
      },
      {
        id: 'q2',
        question: 'What is the minimum recommended distance between major furniture pieces?',
        options: ['30cm', '60cm', '90cm', '150cm'],
        correctIndex: 2,
        explanation:
          'Roughly 90cm — enough to walk through comfortably without turning sideways, even with a coffee in hand.',
      },
      {
        id: 'q3',
        question: 'Why does AI tend to produce layouts that lack tension?',
        options: [
          'It uses outdated training data.',
          'It loves to fill space evenly, which kills focal points.',
          'It does not know how to read floor plans.',
          'It always produces minimalist layouts.',
        ],
        correctIndex: 1,
        explanation:
          'Even distribution feels safe to AI but flat to humans. A great room has a clear hero — and the rest of the layout serves it.',
      },
    ],
  },
  {
    id: 'visualisation',
    number: '05',
    title: 'Instant',
    titleEm: 'Visualisation',
    tagline:
      'The game-changer module. Upload a client room, generate a redesign, close the deal in the same meeting.',
    duration: '~30 min',
    tools: ['RoomGPT'],
    interactive: null,
    lessons: [
      {
        id: 'before-after',
        title: 'The before/after move that closes deals',
        sections: [
          {
            type: 'paragraph',
            content:
              'Visuals close clients. Plans confuse them. The most powerful sales move in modern interior design is to take a photo of a room and, in front of the client, generate a redesigned version of it. Watching their reaction is, in this author\'s experience, the highest-leverage twenty seconds in the entire sales cycle.',
          },
          {
            type: 'callout',
            content: 'A client who can see it will pay for it. A client who has to imagine it will hesitate.',
          },
        ],
      },
      {
        id: 'in-meeting',
        title: 'How to use it inside a sales meeting',
        sections: [
          {
            type: 'list',
            content: [
              'Open the meeting with one before/after you prepared in advance — sets the tone',
              'Mid-meeting, ask the client for a room photo and generate live — earns trust',
              'When they ask "can you do X?" — generate it on the spot rather than describing it',
              'Always have three style directions ready, not one. Choice closes deals.',
            ],
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Take a real photo of any room. Generate two redesigned versions and pitch them as if to a paying client.',
      guidance:
        'Use RoomGPT or a similar tool. Write down what you would say out loud as you reveal each version. The script matters as much as the image — practice both.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'According to this module, what closes clients faster?',
        options: ['Detailed floor plans.', 'Long written proposals.', 'Visuals — especially before/after.', 'Reference Pinterest boards.'],
        correctIndex: 2,
        explanation:
          'Plans require imagination. Visuals require none. The before/after is the highest-leverage twenty seconds in the sales cycle.',
      },
      {
        id: 'q2',
        question: 'How many style directions should you have ready going into a sales meeting?',
        options: ['One — be decisive.', 'Two.', 'Three — choice closes deals.', 'Five or more.'],
        correctIndex: 2,
        explanation:
          'Three is the sweet spot. Enough variety to feel chosen, few enough to be decisive.',
      },
    ],
  },
  {
    id: 'rendering',
    number: '06',
    title: 'Rendering & Client',
    titleEm: 'WOW',
    tagline:
      'Photoreal visuals that look like a high-end studio shot them. Lighting, texture, shadow — all of it.',
    duration: '~35 min',
    tools: ['Rendair AI', 'Enscape'],
    interactive: null,
    lessons: [
      {
        id: 'render-fundamentals',
        title: 'The three render fundamentals',
        sections: [
          {
            type: 'paragraph',
            content:
              'A great render is not a great model. A great render is great <em>lighting</em>, great <em>texture</em>, and great <em>shadow</em>. Master these three and your renders stop looking AI-generated.',
          },
          {
            type: 'list',
            content: [
              '<strong>Lighting</strong> — direction, color temperature, intensity. Side light is almost always more interesting than overhead.',
              '<strong>Texture</strong> — high-resolution materials at correct scale. AI tends to undersize textures, which reads as plastic.',
              '<strong>Shadow</strong> — soft, directional, with a believable falloff. Shadow is what convinces the eye that a space is real.',
            ],
          },
        ],
      },
      {
        id: 'presenting',
        title: 'Presenting renders — the rules',
        sections: [
          {
            type: 'list',
            content: [
              'Full-screen on a single slide. Never compete with text.',
              'No more than five renders per project. Curation > volume.',
              'Lead with the hero shot. Save the corners and details for last.',
              'Caption with one sentence — what the client should feel, not what they should see.',
            ],
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Produce one high-end render of a living space and present it as a single-slide hero shot.',
      guidance:
        'Use Rendair, Enscape, or a render module in any AI tool. Write a one-sentence caption — what the client should feel. Show it to a non-designer friend and ask them what mood the room gives off. If they get it right, the render is working.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'What are the three render fundamentals taught in this module?',
        options: [
          'Color, Furniture, Layout',
          'Lighting, Texture, Shadow',
          'Style, Mood, Story',
          'Camera, Perspective, Angle',
        ],
        correctIndex: 1,
        explanation:
          'Lighting, texture, shadow. Get these three right and the model itself almost does not matter.',
      },
      {
        id: 'q2',
        question: 'What is the ideal maximum number of renders per project presentation?',
        options: ['Two', 'Five', 'Ten', 'As many as you have'],
        correctIndex: 1,
        explanation:
          'Five. Curation beats volume. Every additional render after that dilutes the strongest one.',
      },
    ],
  },
  {
    id: 'styling',
    number: '07',
    title: 'Styling &',
    titleEm: 'Sourcing',
    tagline:
      'Test furniture, color, and styling combinations instantly. Avoid expensive sourcing mistakes before you order.',
    duration: '~25 min',
    tools: ['Reimagine Home AI'],
    interactive: null,
    lessons: [
      {
        id: 'styling-principles',
        title: 'Three styling principles, in order of importance',
        sections: [
          {
            type: 'list',
            content: [
              '<strong>Less is more</strong> — most rooms are over-styled. Remove until you cannot remove more.',
              '<strong>Balance through layering</strong> — texture against texture, height against height, weight against weight.',
              '<strong>One hero, the rest support</strong> — a single statement object per surface, supporting pieces around it.',
            ],
          },
        ],
      },
      {
        id: 'sourcing-with-ai',
        title: 'Using AI to test before you buy',
        sections: [
          {
            type: 'paragraph',
            content:
              'The single most expensive design mistake is buying the wrong piece for the room. AI styling tools let you place candidate pieces virtually before sourcing them physically. The cost of a wrong AI rendering is zero. The cost of a wrong velvet sofa is everything.',
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Style a coffee table with three objects. Test five layouts. Pick the strongest and explain why.',
      guidance:
        'Use Reimagine Home or a similar AI tool. Three objects only — a bowl, a stack of books, a sculptural piece. Five layout permutations. The "why" sentence is the deliverable, not the photo.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the single most expensive design mistake mentioned in this module?',
        options: [
          'Choosing the wrong paint color.',
          'Buying the wrong furniture for the room.',
          'Hiring the wrong photographer.',
          'Picking the wrong rug size.',
        ],
        correctIndex: 1,
        explanation:
          'Furniture is the highest-cost decision and the hardest to undo. AI lets you test placements before money moves.',
      },
      {
        id: 'q2',
        question: 'What is the first styling principle in order of importance?',
        options: [
          'Symmetry above all.',
          'Maximalism — fill every surface.',
          'Less is more — remove until you cannot remove more.',
          'Always use odd numbers of objects.',
        ],
        correctIndex: 2,
        explanation:
          'Restraint first, always. Most rooms are over-styled. Removal is a design move.',
      },
    ],
  },
  {
    id: 'workflow',
    number: '08',
    title: 'The Full AI',
    titleEm: 'Workflow',
    tagline:
      'A real project, end to end. Brief → concepts → moodboard → layout → render → final presentation. Your portfolio piece.',
    duration: '~50 min',
    tools: ['All of the above'],
    interactive: null,
    lessons: [
      {
        id: 'six-steps',
        title: 'The six-step signature workflow',
        sections: [
          {
            type: 'paragraph',
            content:
              'Every previous module has been a tool. This module is the assembly. A real project has six steps, and AI threads through every one. Run this once and you own the workflow.',
          },
          {
            type: 'list',
            content: [
              '<strong>Step 1 — Brief</strong> — read it twice, summarise in three sentences a client would sign',
              '<strong>Step 2 — Concepts</strong> — generate five concept directions in the prompt builder',
              '<strong>Step 3 — Moodboard</strong> — pick one direction, build the board, generate a palette',
              '<strong>Step 4 — Layout</strong> — plan the space, test two arrangements',
              '<strong>Step 5 — Visualisation</strong> — render the chosen direction',
              '<strong>Step 6 — Presentation</strong> — assemble the deck, write the captions, rehearse',
            ],
          },
        ],
      },
      {
        id: 'why-it-matters',
        title: 'Why this module is the one that pays for the course',
        sections: [
          {
            type: 'paragraph',
            content:
              'Eight modules of theory are useless without one full run-through. The portfolio piece you produce here is the artifact you will use to win your next paid project. Treat it accordingly.',
          },
          {
            type: 'callout',
            content: 'You are not learning AI. You are learning to ship.',
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Complete a full mini-project — brief, concepts, moodboard, layout, render, presentation. End to end.',
      guidance:
        'Pick a real or invented brief. Run all six steps. The deliverable is the deck — not the individual outputs. This is the artifact you will show clients. Make it count.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'How many steps are in the signature workflow?',
        options: ['Three', 'Five', 'Six', 'Nine'],
        correctIndex: 2,
        explanation: 'Six steps: Brief, Concepts, Moodboard, Layout, Visualisation, Presentation.',
      },
      {
        id: 'q2',
        question: 'Which step is the actual deliverable that wins clients?',
        options: [
          'The moodboard.',
          'The render.',
          'The full presentation deck.',
          'The brief summary.',
        ],
        correctIndex: 2,
        explanation:
          'Individual outputs are inputs. The deck is the artifact. Treat it as the product.',
      },
    ],
  },
  {
    id: 'business',
    number: '09',
    title: 'Business &',
    titleEm: 'Monetisation',
    tagline:
      'Position yourself as an AI-enhanced premium designer. Price for value, not for hours. Build offers people actually buy.',
    duration: '~30 min',
    tools: ['Strategy'],
    interactive: null,
    lessons: [
      {
        id: 'pricing-model',
        title: 'Why faster delivery does not mean lower fees',
        sections: [
          {
            type: 'paragraph',
            content:
              'The instinct, when AI lets you work faster, is to lower your price proportionally. This is wrong. Clients pay for outcome, not for hours. Faster delivery is itself a premium feature — it should command a higher fee, not a lower one.',
          },
          {
            type: 'callout',
            content: 'Bill the value. Hide the speed.',
          },
        ],
      },
      {
        id: 'service-packaging',
        title: 'Three service offers worth selling',
        sections: [
          {
            type: 'list',
            content: [
              '<strong>Concept Sprint</strong> — five concepts in 48 hours. Premium price, premium delivery window.',
              '<strong>Virtual Redesign</strong> — before/after on a single room, delivered as a five-slide deck.',
              '<strong>AI-Powered Consultation</strong> — a one-hour live session where you generate options on the spot.',
            ],
          },
        ],
      },
    ],
    exercise: {
      prompt: 'Define one offer. What you sell, what you charge, and who you sell it to. Walk away with a packaged service.',
      guidance:
        'Pick one of the three formats above. Write a single page: the offer, the price (in AED or your local currency), the delivery window, the deliverable. This is the page you will send to your next prospect.',
    },
    quiz: [
      {
        id: 'q1',
        question: 'When AI lets you work faster, you should:',
        options: [
          'Lower your prices proportionally.',
          'Keep prices the same and pocket the difference.',
          'Position speed as a premium and charge more.',
          'Hire more designers.',
        ],
        correctIndex: 2,
        explanation:
          'Bill the value, hide the speed. Faster delivery is itself a premium offering.',
      },
      {
        id: 'q2',
        question: 'Which is one of the three signature offers taught in this module?',
        options: [
          'Free Pinterest board.',
          'Concept Sprint — five concepts in 48 hours.',
          'Hourly consulting only.',
          'Bulk staging.',
        ],
        correctIndex: 1,
        explanation:
          'The Concept Sprint is fast, premium, and uses your AI workflow as the engine. Easy to sell, easy to deliver.',
      },
    ],
  },
];
