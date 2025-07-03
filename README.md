# frontend-rag

A modern browser-based demo for real-time text vectorization using Hugging Face’s all-MiniLM-L6-v2 sentence transformer (via @huggingface/transformers and Xenova ONNX).

## Live URL

https://dto-btn.github.io/frontend-rag-test-panel/

## Features

- Vectorize any input text in the browser—no backend required
- Uses the real all-MiniLM-L6-v2 model for embeddings
- Shows vectorization speed and vector preview
- Includes a stress test panel to benchmark embedding speed

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. Open your browser to the local address shown in the terminal.

## Usage

- Enter text and click “Vectorize Text” to see its embedding and speed.

## License

MIT
