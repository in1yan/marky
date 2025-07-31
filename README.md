


# ✨ Marky

Marky is a minimal Markdown editor built with:

- ⚙️ **Wails** for the Go backend
- ⚛️ **React** for the frontend
- 📝 **EasyMDE** for the editor experience
- 🌈 **Highlight.js** for syntax highlighting
- 💾 File I/O via Wails bindings


---

## 🚀 Features

- 📄 Load & save `.md` files from the command line.
- 🎯 Live preview of rendered markdown
- 🧠 Syntax highlighting for code blocks
- 🧘‍♂️ Vim keybindings via EasyMDE
- 🔥 Minimal, fullscreen editor layout

---

## 🛠️ Setup & Run

### 1. Clone the project

```bash
git clone https://github.com/in1yan/marky.git
cd marky
````

### 2. Install Go dependencies

```bash
go mod tidy
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Run in development mode

```bash
# From root
wails dev
```

---

## 📦 Build for production

```bash
wails build
```

---

