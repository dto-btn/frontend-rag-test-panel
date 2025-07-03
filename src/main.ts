import './style.css'
import { pipeline, env } from '@huggingface/transformers';

// Configure environment for client-side usage
env.allowLocalModels = false;
env.allowRemoteModels = true;

class VectorizationDemo {
  private featureExtractor: any = null;
  private isLoading = false;

  async initializeModel() {
    if (this.featureExtractor || this.isLoading) return;
    
    this.isLoading = true;
    this.updateStatus('Loading sentence transformer model...');
    
    try {
      // Initialize the sentence transformer pipeline
      this.featureExtractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
      
      this.updateStatus('Model loaded successfully!');
      this.isLoading = false;
    } catch (error) {
      this.updateStatus(`Error loading model: ${error}`);
      this.isLoading = false;
    }
  }

  async vectorizeText(text: string) {
    if (!this.featureExtractor) {
      await this.initializeModel();
    }

    if (!this.featureExtractor) {
      throw new Error('Model not loaded');
    }

    this.updateStatus(`Vectorizing: "${text}"`);
    
    try {
      // Get embeddings from the model
      const embeddings = await this.featureExtractor(text, {
        pooling: 'mean',
        normalize: true
      });
      
      // Extract the numerical data
      const vector = embeddings.data;
      const vectorArray = Array.from(vector) as number[];
      
      this.displayResults(text, vectorArray);
      return vectorArray;
    } catch (error) {
      this.updateStatus(`Error during vectorization: ${error}`);
      return null;
    }
  }

  updateStatus(message: string) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  displayResults(text: string, vector: number[]) {
    const resultsElement = document.getElementById('results');
    if (!resultsElement) return;

    const vectorPreview = vector.slice(0, 10).map(v => v.toFixed(4)).join(', ');
    
    resultsElement.innerHTML = `
      <div class="result-item">
        <h3>Vectorization Result</h3>
        <p><strong>Input Text:</strong> "${text}"</p>
        <p><strong>Vector Dimensions:</strong> ${vector.length}</p>
        <p><strong>Vector Preview (first 10 dimensions):</strong> [${vectorPreview}...]</p>
        <details>
          <summary>Full Vector (click to expand)</summary>
          <pre class="vector-display">[${vector.map(v => v.toFixed(6)).join(',\n ')}]</pre>
        </details>
      </div>
    `;
    
    this.updateStatus('Vectorization complete!');
  }
}

// Initialize the demo
const demo = new VectorizationDemo();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>🤗 Sentence Transformers Vectorization Demo</h1>
    <p>Using: <code>sentence-transformers/all-MiniLM-L6-v2</code></p>
    
    <div class="input-section">
      <label for="textInput">Enter text to vectorize:</label>
      <textarea 
        id="textInput" 
        placeholder="Enter any text here to see its vector representation..."
        rows="3"
      >The quick brown fox jumps over the lazy dog.</textarea>
      <button id="vectorizeBtn">Vectorize Text</button>
      <button id="loadModelBtn">Load Model</button>
    </div>
    
    <div class="status-section">
      <div id="status">Click "Load Model" to initialize the sentence transformer</div>
    </div>
    
    <div id="results" class="results-section"></div>
    
    <div class="examples-section">
      <h3>Try these examples:</h3>
      <div class="example-buttons">
        <button class="example-btn" data-text="I love machine learning and AI">Example 1: AI Text</button>
        <button class="example-btn" data-text="The weather is beautiful today">Example 2: Weather</button>
        <button class="example-btn" data-text="Python is a great programming language">Example 3: Programming</button>
      </div>
    </div>
  </div>
`;

// Event listeners
document.getElementById('loadModelBtn')?.addEventListener('click', async () => {
  await demo.initializeModel();
});

document.getElementById('vectorizeBtn')?.addEventListener('click', async () => {
  const textInput = document.getElementById('textInput') as HTMLTextAreaElement;
  const text = textInput.value.trim();
  
  if (!text) {
    demo.updateStatus('Please enter some text to vectorize');
    return;
  }
  
  await demo.vectorizeText(text);
});

// Example button listeners
document.querySelectorAll('.example-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const target = e.target as HTMLButtonElement;
    const exampleText = target.dataset.text;
    
    if (exampleText) {
      const textInput = document.getElementById('textInput') as HTMLTextAreaElement;
      textInput.value = exampleText;
      await demo.vectorizeText(exampleText);
    }
  });
});

// Auto-load model on page load
demo.initializeModel();
