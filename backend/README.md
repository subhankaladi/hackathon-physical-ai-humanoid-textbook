# Docusaurus Embedding Pipeline

This project extracts text from deployed Docusaurus URLs, generates embeddings using Cohere, and stores them in Qdrant for RAG-based retrieval.

## Features

- Crawls Docusaurus sites to extract all accessible URLs
- Extracts and cleans text content from each page
- Chunks large documents to optimize embedding quality
- Generates vector embeddings using Cohere's API
- Stores embeddings in Qdrant vector database with metadata
- Supports similarity search for RAG applications

## Prerequisites

- Python 3.9+
- UV package manager (`pip install uv`)
- Cohere API key
- Qdrant instance (local or cloud)

## Setup

1. Clone the repository and navigate to the backend directory
2. Install UV package manager:
   ```bash
   pip install uv
   ```

3. Install dependencies:
   ```bash
   cd backend
   uv sync  # or uv pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Cohere API key and Qdrant configuration
   ```

## Configuration

The pipeline can be configured via environment variables in the `.env` file:

- `COHERE_API_KEY`: Your Cohere API key
- `QDRANT_URL`: URL to your Qdrant instance
- `QDRANT_API_KEY`: API key for Qdrant (if required)
- `TARGET_URL`: The Docusaurus site to process

## Usage

Run the complete pipeline:
```bash
uv run main.py
```

## Architecture

The pipeline consists of these main functions:

1. `get_all_urls()` - Extracts all URLs from the target Docusaurus site
2. `extract_text_from_url()` - Cleans and extracts text content from a URL
3. `chunk_text()` - Splits large documents into manageable chunks
4. `embed()` - Generates vector embeddings using Cohere
5. `create_collection()` - Sets up the Qdrant collection
6. `save_chunk_to_qdrant()` - Stores embeddings with metadata in Qdrant

The main function orchestrates the complete workflow from crawling to storage.

## Output

The pipeline stores document chunks as vectors in a Qdrant collection named "rag_embedding" with the following metadata:
- Content text
- Source URL
- Position in original document
- Creation timestamp