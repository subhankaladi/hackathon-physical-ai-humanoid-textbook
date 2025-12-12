# Quickstart Guide: Docusaurus Embedding Pipeline

## Prerequisites

### System Requirements
- Python 3.9 or higher
- UV package manager (install with `pip install uv` or via package manager)
- Access to Cohere API (sign up at https://cohere.com/)
- Access to Qdrant (can be local or cloud instance)

### Environment Setup
1. Navigate to the backend directory
2. Install UV package manager:
   ```bash
   pip install uv
   ```

## Initial Setup

### 1. Install Dependencies
```bash
cd backend
uv sync
```

### 2. Set Up Environment Variables
Copy and edit the `.env` file in the backend directory:
```bash
cp .env.example .env
# Edit .env with your Cohere API key and Qdrant configuration
```

## Running the Pipeline

### Execute the Pipeline
```bash
uv run main.py
```

## Configuration

### Target Website
The pipeline is configured to process:
- Base URL: https://hackathon-physical-ai-humanoid-text-sigma.vercel.app/

### Default Parameters
- Chunk size: 1000 characters
- Chunk overlap: 100 characters
- Qdrant collection name: "rag_embedding"
- Cohere embedding model: "embed-multilingual-v3.0"

## Expected Output
- All pages from the target Docusaurus site will be crawled
- Content will be extracted and cleaned
- Text will be chunked and embedded
- Embeddings will be stored in Qdrant collection "rag_embedding"
- Processed chunks will be available for RAG applications

## Troubleshooting

### Common Issues
1. **API Rate Limits**: If you encounter rate limit errors, add delays between API calls
2. **Connection Issues**: Verify Qdrant URL and credentials
3. **Cohere API Errors**: Check API key validity and quota limits

### Verification Steps
1. Check that all dependencies are installed: `uv pip list`
2. Verify environment variables are set: `echo $COHERE_API_KEY` (or appropriate command for your OS)
3. Confirm Qdrant is accessible: Try connecting with the Qdrant client directly