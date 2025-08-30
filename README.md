# 🎨 Vite AI CSS Plugin

> Transform natural language descriptions into Tailwind CSS classes with AI magic ✨

A Vite plugin that automatically generates Tailwind CSS classes using AI models like Ollama and Gemini. Simply describe what you want in Polish or English, and watch as your styles come to life!

## ✨ Features

- 🧠 **AI-Powered**: Leverages Ollama or Gemini to generate CSS classes
- 🌍 **Multilingual**: Works with Polish and English descriptions
- ⚡ **Fast**: Integrates seamlessly with Vite's dev server
- 🎯 **Smart**: Generates modern, responsive designs automatically
- 🔄 **Flexible**: Switch between different AI backends

## 🚀 Installation

```bash
# Clone or copy the plugin to your project
# Add to your vite.config.js/ts
```

## 📋 Usage

### 1. Configure the plugin in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import AiCssPlugin from 'vite-ai-css-plugin'

export default defineConfig({
  plugins: [
    AiCssPlugin({
      backend: {
        ollama: {
          url: "http://localhost:11434/api/generate",
          model: "qwen3:1.7b",
        },
        gemini: {
          apikey: "YOUR_GEMINI_API_KEY",
          model: "gemini-1.5-flash",
        },
      },
      active: "ollama", // or "gemini"
    }),
    react(),
    tailwindcss(),
  ],
})
```

### 2. Use in your React components:

```jsx
function App() {
  return (
    <div className={aiCss("główny kontener, pełna wysokość ekranu, gradient niebieski do fioletowego")}>
      <h1 className={aiCss("duży tytuł, biały tekst, cień")}>
        Hello AI CSS! 
      </h1>
      <button className={aiCss("przycisk, niebieski, hover efekt, zaokrąglone rogi")}>
        Click me
      </button>
    </div>
  )
}
```

### 3. Watch the magic happen! 🪄

The plugin transforms your descriptions into proper Tailwind classes:
- `"główny kontener, pełna wysokość"` → `"min-h-screen flex flex-col"`
- `"przycisk, niebieski, hover efekt"` → `"bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"`

## ⚙️ Configuration

### Backends

**Ollama** (Local)
```typescript
ollama: {
  url: "http://localhost:11434/api/generate",
  model: "qwen3:1.7b" // or any other model
}
```

**Gemini** (Cloud)
```typescript
gemini: {
  apikey: "your-api-key-here",
  model: "gemini-1.5-flash"
}
```

## 💡 Examples

```jsx
// Polish descriptions
<div className={aiCss("karta produktu, cień, białe tło, zaokrąglone")}>
<img className={aiCss("obrazek, pełna szerokość, proporcje zachowane")} />
<h3 className={aiCss("tytuł, pogrubiony, ciemny tekst")}>Product</h3>

// English descriptions  
<nav className={aiCss("navigation bar, sticky top, dark background")}>
<button className={aiCss("menu button, hamburger style, mobile responsive")}>
```

## 🛠️ Requirements

- Node.js 16+
- Vite
- Tailwind CSS
- One of:
  - Ollama (local AI server)
  - Gemini API key

## ⚡ Development

The plugin processes `.jsx` and `.tsx` files during build time, replacing `aiCss()` calls with generated class strings.

## 🤝 Contributing

This started as a fun experiment - feel free to improve it! PRs welcome.

## 📝 License

MIT - Have fun with it! 🎉

---

*Made with ❤️ and a bit of AI magic*