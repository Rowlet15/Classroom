# PortalHub Unblocked Games

A fast, sleek unblocked games web portal with instant iframe playback, stealth tab cloaking, panic escape hotkey, and a JSON-powered game library.

---

## 🚀 Live GitHub Pages Deployment (Quick Setup)

This repository includes a ready-to-run GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and publishes the website to GitHub Pages on every push.

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g., `portalhub-games` or `unblocked-games`).
2. Make it **Public** (or Private if you have GitHub Pro for Pages).

### Step 2: Push This Codebase to GitHub
In your terminal, run:

```bash
# Initialize git if not already initialized
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit of PortalHub Unblocked Games"

# Rename branch to main
git branch -M main

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages in Repository Settings
1. On GitHub, navigate to your repository.
2. Click **Settings** (top tab).
3. On the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment > Source**, select:
   👉 **GitHub Actions**
5. That's it! GitHub will automatically trigger the deployment workflow. Within 1–2 minutes, your website will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🎮 Included Games (Stored in `public/games.json`)

All games are stored cleanly in `public/games.json` and loaded via isolated `<iframe>` elements:

- **Basket Bros**: 1-on-1 retro street basketball with dunks and 3-pointers (`https://smuhsd.instructure.click/games/Basket%20Bros/index.html`)
- **Neon Snake Arcade**: Standalone HTML5 canvas snake game with particle multipliers
- **Cosmic Rebel: Starfighter**: Top-down space combat arcade game with shields & boss waves
- **Cyber Rooftop Runner**: High-speed double-jump endless parkour runner
- **2048 Neon Pulse**: Modern neon numbered tile slider with swipe & keyboard support
- **Neon Breakout**: Classic paddle-and-brick breaker with physics reflections
- **Cyber Minesweeper**: Deductive puzzle with flag mode, timer, and first-click safety
- **Cyber Pong 1v1**: 1-Player retro cyber tennis vs adaptive AI
- **Pixel Flight**: Flappy-style bird flight game with gravity physics

---

## 🛠 Adding More Games to `public/games.json`

To add any new game, simply add a new object to `public/games.json`:

```json
{
  "id": "my-game-id",
  "title": "My Awesome Game",
  "description": "Short description of gameplay and objectives.",
  "category": "Arcade",
  "iframeUrl": "https://example.com/game/index.html",
  "thumbnail": "",
  "rating": 5.0,
  "plays": 1200,
  "featured": false,
  "controls": [
    "Arrow Keys to steer",
    "Spacebar to trigger boost"
  ],
  "tags": ["Action", "Fun"]
}
```

You can also use the in-app **"Add Custom Game"** button to add games with live iframe previews, or download and import custom JSON libraries via the **JSON Library** button.

---

## 🛡️ Stealth & Privacy Features

- **Tab Cloaker**: Change page title and favicon on the fly (Google Classroom, Google Docs, Google Drive, Canvas LMS, Desmos, Wikipedia).
- **About:Blank Launcher**: Injects any game into a clean `about:blank` window, avoiding browser history logs and filter URL trackers.
- **Panic Escape Hotkey**: Press <kbd>Esc</kbd> or <kbd>]</kbd> anywhere to immediately redirect to Google Classroom (customizable).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Build production static bundle to /dist
npm run build

# Preview production build locally
npm run preview
```
