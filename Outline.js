import { GoogleGenAI } from "@google/genai";

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: "unlv02",
  location: "us-central1",
});
const model = "gemini-2.5-pro";

const siText1 = {
  text: `AI Virtual Character Chatbot (for Special Education & Communication)
Target: Developmental Language Disorder, Speech Sound Disorder, Speech or Language Delay Kids 
🌟 Idea
Children input favorite character styles, colors, and traits 
→ AI generates a virtual character.
Simulated conversations with the character 
→ helps practice communication and provides emotional support.
💰 Business 
Character merchandise (toys, stickers, custom goods).
License sales to educational institutions and therapy centers.`,
};

// Set up generation config
const generationConfig = {
  maxOutputTokens: 32908,
  temperature: 0.4,
  topP: 0.8,
  seed: 0,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "OFF",
    },
  ],
  systemInstruction: {
    parts: [siText1],
  },
};

const msg1Text1 = {
  text: `Help me build a child-friendly UI for a web-based chatbot application designed to support kids with developmental language challenges (such as DLD, SSD, or speech delays).

The chatbot should be represented by a customizable virtual character based on user-selected preferences (style, color, and personality traits).

The UI should include the following:

1. **Landing Screen**  
  - Let children select their favorite color, character type (e.g., animal, robot, dinosaur), and traits (e.g., kind, silly, brave).

2. **Chatbot Screen**  
  - A chat bubble-style layout (similar to iMessage).  
  - Large, easy-to-read text with emoji support.  
  - A microphone button for voice-to-text input.  
  - An animated avatar that reflects the selected character.  
  - Text-to-speech output (AI speaks the response).

3. **Persistent Toolbar**  
  - "Home" button  
  - "Settings" for voice and difficulty options  
  - "Sticker Shop" (for rewards/incentives)  
  - "Help" button (for parent/teacher support)

4. **Design Guidelines**  
  - Playful, safe, soothing visuals  
  - Bright but not overstimulating colors  
  - Rounded corners, large touchable UI elements  
  - Child-friendly fonts like Comic Neue or OpenDyslexic

### ⚙️ Technical Requirements
Please build the frontend using:
- **React 18**
- **Vite**
- **CSS Modules**
- **Next.js** (for routing and structure)

Output a minimal but complete React component structure (JSX + CSS Modules), organized and ready for expansion. Use best practices for accessibility and responsive design on touch devices like tablets.`,
};
const msg2Text1 = {
  text: `**Framing the Audience**

I'm now focused on the specifics of the target audience, specifically children with DLD, SSD, and speech delays. This initial deconstruction helps me refine the application's core purpose. It is paramount to keep in mind the unique needs and limitations of these kids as I proceed. This crucial step informs all future design decisions.


**Outlining Application Components**

I've moved into mapping out the app's structure. I'm envisioning a clear layout, including character creation, the chatbot interface, and a persistent toolbar for navigation. Key components will focus on user-friendliness, with large touch targets, simple visuals, and child-friendly fonts.


**Analyzing Feature Set**

I'm currently dissecting the features and user flow. I'm imagining each screen, from character customization to chatbot interactions, and the persistent toolbar. I'm already outlining the basic React component structure. I've thought about the technical stack as React, CSS Modules, and Next.js for routing, after considering the user request for Vite. I will include a landing page for character creation, a chatbot screen, and the always present toolbar with crucial navigation features.


**Prioritizing Project Structure**

I'm now refining the architectural details. I'm focusing on how Next.js's App Router is the best choice for a structured application. My plan is to start with a clear \`app/\` directory, including \`layout.tsx\`, the landing page, and the chat screen. Then I will start building reusable components.


**Mapping Out The App**

I'm deep into imagining the UI, like the iMessage-style chat, avatar animations, and the handy toolbar. I am thinking about the React component structure, specifically how the Next.js's App Router will structure the application. I will make a detailed list of components like the character creator and chat interface.


**Designing Component Structures**

I'm currently focused on sketching out the core components. The layout will integrate a toolbar, with individual pages for the landing screen, the chat interface, and settings. I'm now outlining these elements, starting with a comprehensive \`layout.tsx\` for global styles and toolbar integration.


**Architecting the Layout**

I'm now focused on the layout's framework, starting with \`layout.tsx\` in the \`app/\` directory, which will host the persistent toolbar and global styles. I will import custom fonts and ensure the toolbar is always visible. The app's main content will live within a flex-column layout.


**Refining Component Design**

I'm now focused on the finer details of component creation, specifically refining character selection and the chat interface. The selection process will use buttons. Next, I plan to outline the messaging system and how it will handle text and audio input.


**Planning the Next Steps**

I'm now focusing on the specifics of the planned application's core functionalities and component interactions. I'll then design the \`ChatInterface\` component, and the structure of the messaging, which is the core element. I'll also explore adding user input with both text and audio.


**Evaluating Design Choices**

I'm now considering the strengths and weaknesses of my prior choices. I'm reviewing the component structure, with an eye on the Next.js App Router and CSS Modules. I will ensure that my approach is maintainable, and that the UI will look good.


**Evaluating the Plan**

I'm now scrutinizing the plan to confirm it aligns with the user's requirements. I'm particularly focused on the component designs, assessing how they will meet the needs of children with DLD. I'll adjust the plan as needed to include these elements in each component.`,
};
const msg2Text2 = {
  text: `Of course! This is an excellent and impactful idea. Building a child-friendly UI for this purpose requires a focus on simplicity, clarity, and engagement.

I will structure this project using **Next.js**, as it provides a robust framework for routing, structure, and server-side rendering, which will be beneficial as the app grows. While Vite is a fantastic build tool, Next.js is a complete framework that fulfills the "routing and structure" requirement more comprehensively.

Here is a complete, minimal, and ready-to-expand frontend structure using Next.js, React 18, and CSS Modules.

### 1. Project Setup

First, create a new Next.js application:

\`\`\`bash
npx create-next-app@latest my-chatbot-app
# During setup, choose:
# ✔ Would you like to use TypeScript? … No / Yes (I'll use JavaScript for simplicity)
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … No
# ✔ Would you like to use \`src/\` directory? … No
# ✔ Would you like to use App Router? (recommended) … Yes
# ✔ Would you like to customize the default import alias? … No
\`\`\`

After setup, \`cd my-chatbot-app\` and you can start creating the files below.

### 2. File Structure

Here is the file structure we will create inside the \`app\` directory.

\`\`\`
my-chatbot-app/
├── app/
│   ├── chat/
│   │   └── page.jsx        # The main chat screen
│   ├── settings/
│   │   └── page.jsx        # Placeholder for settings page
│   ├── stickers/
│   │   └── page.jsx        # Placeholder for sticker shop
│   ├── help/
│   │   └── page.jsx        # Placeholder for help page
│   ├── components/
│   │   ├── Avatar.jsx
│   │   ├── Avatar.module.css
│   │   ├── CharacterCreator.jsx
│   │   ├── CharacterCreator.module.css
│   │   ├── ChatInterface.jsx
│   │   ├── ChatInterface.module.css
│   │   └── Toolbar.jsx
│   │   └── Toolbar.module.css
│   ├── layout.jsx          # Root layout with persistent toolbar
│   ├── page.jsx            # Landing screen (character creation)
│   └── globals.css         # Global styles and fonts
└── public/
    └── mic-icon.svg        # Placeholder for microphone icon
\`\`\`

### 3. Code Implementation

#### \`app/globals.css\`

Let's define our color palette, fonts, and base styles. We'll use CSS variables for easy theming. I've included \`Comic Neue\` as requested.

\`\`\`css
/* Import a child-friendly font */
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');

:root {
  /* Colors */
  --background-main: #f0f8ff; /* AliceBlue */
  --background-secondary: #ffffff;
  --primary-accent: #00a8e8; /* A bright, friendly blue */
  --secondary-accent: #ffc857; /* A warm yellow */
  --text-dark: #333333;
  --text-light: #ffffff;
  --border-color: #d1d1d1;
  --shadow-color: rgba(0, 0, 0, 0.1);

  /* Fonts */
  --font-family-main: 'Comic Neue', 'OpenDyslexic', cursive, sans-serif;

  /* Sizing */
  --border-radius: 16px;
  --toolbar-height: 80px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-family-main);
  background-color: var(--background-main);
  color: var(--text-dark);
}

main {
  padding: 2rem;
  padding-bottom: calc(var(--toolbar-height) + 2rem); /* Avoid overlap with toolbar */
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}
\`\`\`

---

#### \`app/layout.jsx\` (Root Layout)

This file wraps every page. It's the perfect place for our persistent toolbar.

\`\`\`jsx
import './globals.css';
import Toolbar from './components/Toolbar';

export const metadata = {
  title: 'BuddyChat',
  description: 'Your friendly AI chat companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toolbar />
      </body>
    </html>
  );
}
\`\`\`

---

#### \`app/components/Toolbar.jsx\` & \`Toolbar.module.css\`

The persistent navigation bar at the bottom of the screen.

**\`Toolbar.jsx\`**
\`\`\`jsx
import Link from 'next/link';
import styles from './Toolbar.module.css';

// In a real app, you'd use SVG icons here
const HomeIcon = () => <span>🏠</span>;
const SettingsIcon = () => <span>⚙️</span>;
const StickerIcon = () => <span>⭐</span>;
const HelpIcon = () => <span>❓</span>;

export default function Toolbar() {
  return (
    <nav className={styles.toolbar}>
      <Link href="/" className={styles.navButton} aria-label="Home">
        <HomeIcon />
        <span>Home</span>
      </Link>
      <Link href="/settings" className={styles.navButton} aria-label="Settings">
        <SettingsIcon />
        <span>Settings</span>
      </Link>
      <Link href="/stickers" className={styles.navButton} aria-label="Sticker Shop">
        <StickerIcon />
        <span>Stickers</span>
      </Link>
      <Link href="/help" className={styles.navButton} aria-label="Help">
        <HelpIcon />
        <span>Help</span>
      </Link>
    </nav>
  );
}
\`\`\`

**\`Toolbar.module.css\`**
\`\`\`css
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--toolbar-height);
  background-color: var(--background-secondary);
  border-top: 2px solid var(--border-color);
  box-shadow: 0 -4px 12px var(--shadow-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.navButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-accent);
  padding: 8px;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
  width: 70px; /* Ensure large touch target */
  height: 70px;
}

.navButton:hover,
.navButton:focus {
  background-color: #e0f7fa; /* Light blue hover */
}

.navButton span:first-child {
  font-size: 2rem; /* Larger icon */
}
\`\`\`

---

#### \`app/page.jsx\` (Landing Screen)

This is the entry point of our app, where children create their character.

\`\`\`jsx
import CharacterCreator from './components/CharacterCreator';

export default function HomePage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
        Create Your Buddy!
      </h1>
      <CharacterCreator />
    </div>
  );
}
\`\`\`

---

#### \`app/components/CharacterCreator.jsx\` & \`CharacterCreator.module.css\`

The UI for selecting character options.

**\`CharacterCreator.jsx\`**
\`\`\`jsx
'use client'; // This component uses client-side state and events

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CharacterCreator.module.css';

const COLORS = [
  { name: 'Blue', value: '#3498db' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Purple', value: '#9b59b6' },
];
const TYPES = ['Animal 🐼', 'Robot 🤖', 'Dinosaur 🦖'];
const TRAITS = ['Kind 😊', 'Silly 🤪', 'Brave 💪'];

export default function CharacterCreator() {
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [trait, setTrait] = useState('');
  const router = useRouter();

  const handleStartChat = () => {
    if (color && type && trait) {
      const query = new URLSearchParams({
        color,
        type: type.split(' ')[0], // Send only the word
        trait: trait.split(' ')[0],
      }).toString();
      router.push(\`/chat?${query}\`);
    }
  };

  return (
    <div className={styles.creator}>
      <section className={styles.section}>
        <h2 className={styles.title}>1. Pick a color</h2>
        <div className={styles.optionsGrid}>
          {COLORS.map((c) => (
            <button
              key={c.name}
              className={\`${styles.optionCard} ${
    color === c.value ? styles.selected : ""
  }\`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              aria-pressed={color === c.value}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>2. Choose a type</h2>
        <div className={styles.optionsGrid}>
          {TYPES.map((t) => (
            <button
              key={t}
              className={\`${styles.optionCard} ${
    type === t ? styles.selected : ""
  }\`}
              onClick={() => setType(t)}
              aria-pressed={type === t}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>3. Add a personality</h2>
        <div className={styles.optionsGrid}>
          {TRAITS.map((t) => (
            <button
              key={t}
              className={\`${styles.optionCard} ${
    trait === t ? styles.selected : ""
  }\`}
              onClick={() => setTrait(t)}
              aria-pressed={trait === t}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <button
        className={styles.startButton}
        onClick={handleStartChat}
        disabled={!color || !type || !trait}
      >
        Let's Chat!
      </button>
    </div>
  );
}
\`\`\`

**\`CharacterCreator.module.css\`**
\`\`\`css
.creator {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background-color: var(--background-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.title {
  font-size: 1.8rem;
  color: var(--primary-accent);
  margin-bottom: 1rem;
  text-align: center;
}

.optionsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.optionCard {
  padding: 1.5rem 1rem;
  border-radius: var(--border-radius);
  border: 4px solid transparent;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #f0f0f0;
  color: var(--text-dark);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.optionCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px var(--shadow-color);
}

.optionCard.selected {
  border-color: var(--secondary-accent);
  transform: scale(1.05);
  box-shadow: 0 6px 16px var(--shadow-color);
}

.startButton {
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-light);
  background-color: var(--primary-accent);
  border: none;
  border-radius: 50px; /* Fun, pill shape */
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  align-self: center;
  margin-top: 1rem;
}

.startButton:hover {
  background-color: #0077b6; /* Darker blue */
  transform: scale(1.05);
}

.startButton:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
  transform: none;
}
\`\`\`

---

#### \`app/chat/page.jsx\` (Chatbot Screen)

This page will host the chat interface. It uses \`useSearchParams\` to get character data from the URL.

\`\`\`jsx
'use client'; // This page uses hooks

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatInterface from '../components/ChatInterface';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const character = {
    color: searchParams.get('color') || '#cccccc',
    type: searchParams.get('type') || 'Friend',
    trait: searchParams.get('trait') || 'Nice',
  };

  return <ChatInterface character={character} />;
}

export default function ChatPage() {
  return (
    // Suspense is required by Next.js when using useSearchParams
    <Suspense fallback={<div>Loading your buddy...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
\`\`\`

---

#### \`app/components/ChatInterface.jsx\` & \`ChatInterface.module.css\`

The core chat UI.

**\`ChatInterface.jsx\`**
\`\`\`jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ChatInterface.module.css';
import Avatar from './Avatar';

// Placeholder for mic icon
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
  </svg>
);

export default function ChatInterface({ character }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  // Initial greeting from the bot
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: \`Hi! I'm your new ${character.trait} ${
    character.type
  } buddy! What should we talk about? 😄\`,
        sender: 'bot',
      },
    ]);
  }, [character]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');

    // --- AI Response Simulation ---
    // In a real app, you'd call your AI API here.
    // The text-to-speech would be triggered after receiving the API response.
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: \`That's so cool! Tell me more. 🤔\`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
      // **TTS HOOK**: Call text-to-speech here with \`botResponse.text\`
      // For example: \`speak(botResponse.text)\`
    }, 1500);
  };
  
  const handleMicClick = () => {
    // **VOICE-TO-TEXT HOOK**:
    // 1. Start listening for voice input.
    // 2. When speech is recognized, update the input field:
    //    \`setUserInput(recognizedText);\`
    alert("Microphone clicked! Voice-to-text logic would go here.");
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Avatar color={character.color} type={character.type} />
        <div className={styles.characterInfo}>
          <span className={styles.characterName}>{character.type} Buddy</span>
          <span className={styles.characterStatus}>Online</span>
        </div>
      </header>

      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={\`${styles.messageBubble} ${
    msg.sender === "user" ? styles.userMessage : styles.botMessage
  }\`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <button type="button" className={styles.micButton} onClick={handleMicClick} aria-label="Use microphone">
          <MicIcon />
        </button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className={styles.textInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
\`\`\`

**\`ChatInterface.module.css\`**
\`\`\`css
.chatContainer {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--toolbar-height));
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--background-secondary);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px var(--shadow-color);
  overflow: hidden;
}

.chatHeader {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid var(--border-color);
}

.characterInfo {
  margin-left: 1rem;
}

.characterName {
  font-weight: 700;
  font-size: 1.2rem;
  display: block;
}

.characterStatus {
  font-size: 0.9rem;
  color: #5cb85c; /* Green for 'Online' */
}

.messageList {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.messageBubble {
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  max-width: 75%;
  font-size: 1.1rem;
  line-height: 1.5;
}

.botMessage {
  background-color: #e9ecef;
  color: var(--text-dark);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.userMessage {
  background-color: var(--primary-accent);
  color: var(--text-light);
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.inputArea {
  display: flex;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: #f9f9f9;
  gap: 0.5rem;
}

.textInput {
  flex-grow: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: 1.1rem;
  font-family: var(--font-family-main);
}

.textInput:focus {
  outline: none;
  border-color: var(--primary-accent);
}

.micButton,
.sendButton {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0.75rem;
}

.micButton {
  background-color: #e0e0e0;
  color: var(--text-dark);
}

.micButton:hover {
  background-color: #d0d0d0;
}

.sendButton {
  background-color: var(--primary-accent);
  color: var(--text-light);
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
}

.sendButton:hover {
  background-color: #0077b6;
}
\`\`\`

---

#### \`app/components/Avatar.jsx\` & \`Avatar.module.css\`

A simple, reusable avatar component.

**\`Avatar.jsx\`**
\`\`\`jsx
import styles from './Avatar.module.css';

const getEmoji = (type) => {
  switch (type?.toLowerCase()) {
    case 'animal':
      return '🐼';
    case 'robot':
      return '🤖';
    case 'dinosaur':
      return '🦖';
    default:
      return '😊';
  }
};

export default function Avatar({ color, type }) {
  const emoji = getEmoji(type);

  return (
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      <span className={styles.emoji}>{emoji}</span>
    </div>
  );
}
\`\`\`

**\`Avatar.module.css\`**
\`\`\`css
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.emoji {
  font-size: 2rem;
  /* Fix for emoji vertical alignment */
  line-height: 1;
  display: inline-block;
  transform: translateY(1px);
}
\`\`\`

---

#### Placeholder Pages

Create these files so the toolbar links work.

**\`app/settings/page.jsx\`**
\`\`\`jsx
export default function SettingsPage() {
  return <h1 style={{padding: '2rem'}}>Settings Page</h1>;
}
\`\`\`

**\`app/stickers/page.jsx\`**
\`\`\`jsx
export default function StickersPage() {
  return <h1 style={{padding: '2rem'}}>Sticker Shop</h1>;
}
\`\`\`

**\`app/help/page.jsx\`**
\`\`\`jsx
export default function HelpPage() {
  return <h1 style={{padding: '2rem'}}>Help & Parent Resources</h1>;
}
\`\`\`

### 4. How to Run

1.  Make sure you've created all the files in the correct directories.
2.  Run the development server:
    \`\`\`bash
    npm run dev
    \`\`\`
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

You now have a functional, well-structured, and child-friendly UI ready for the next steps: integrating the AI model, text-to-speech, and voice-to-text functionalities.`,
};
const msg3Text1 = {
  text: `node index.js 
(node:5933) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/gabo/Downloads/ChonnamHackathon/index.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/gabo/Downloads/ChonnamHackathon/package.json.
(Use \`node --trace-warnings ...\` to show where the warning was created)
(node:5933) [DEP0040] DeprecationWarning: The \`punycode\` module is deprecated. Please use a userland alternative instead.
/Users/gabo/Downloads/ChonnamHackathon/node_modules/google-auth-library/build/src/auth/googleauth.js:287
    throw new Error(exports.GoogleAuthExceptionMessages.NO_ADC_FOUND);
       ^

Error: Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.
  at GoogleAuth.getApplicationDefaultAsync (/Users/gabo/Downloads/ChonnamHackathon/node_modules/google-auth-library/build/src/auth/googleauth.js:287:15)
  at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
  at async GoogleAuth._GoogleAuth_determineClient (/Users/gabo/Downloads/ChonnamHackathon/node_modules/google-auth-library/build/src/auth/googleauth.js:834:32)
  at async GoogleAuth.getClient (/Users/gabo/Downloads/ChonnamHackathon/node_modules/google-auth-library/build/src/auth/googleauth.js:698:20)
  at async GoogleAuth.getRequestHeaders (/Users/gabo/Downloads/ChonnamHackathon/node_modules/google-auth-library/build/src/auth/googleauth.js:730:24)
  at async NodeAuth.addGoogleAuthHeaders (file:///Users/gabo/Downloads/ChonnamHackathon/node_modules/@google/genai/dist/node/index.mjs:16784:29)
  at async ApiClient.getHeadersInternal (file:///Users/gabo/Downloads/ChonnamHackathon/node_modules/@google/genai/dist/node/index.mjs:13203:9)
  at async ApiClient.includeExtraHttpOptionsToRequestInit (file:///Users/gabo/Downloads/ChonnamHackathon/node_modules/@google/genai/dist/node/index.mjs:13078:31)
  at async ApiClient.requestStream (file:///Users/gabo/Downloads/ChonnamHackathon/node_modules/@google/genai/dist/node/index.mjs:13058:23)
  at async Models.generateContentStream (file:///Users/gabo/Downloads/ChonnamHackathon/node_modules/@google/genai/dist/node/index.mjs:14424:24)

Node.js v22.13.0`,
};

const chat = ai.chats.create({
  model: model,
  config: generationConfig,
});

async function sendMessage(message) {
  const response = await chat.sendMessageStream({
    message: message,
  });
  process.stdout.write("stream result: ");
  for await (const chunk of response) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    } else {
      process.stdout.write(JSON.stringify(chunk) + "\n");
    }
  }
}

async function generateContent() {
  await sendMessage([msg1Text1]);
  await sendMessage([msg2Text1, msg2Text2]);
  await sendMessage([msg3Text1]);
}

generateContent();
