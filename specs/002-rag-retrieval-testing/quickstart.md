# Quickstart Guide: RAG Retrieval Testing

## Prerequisites

### System Requirements
- Python 3.9 or higher
- Existing backend project with UV package manager
- Access to Cohere API (same credentials as embedding pipeline)
- Access to Qdrant (same instance used for storage)
- Previously stored embeddings in "rag_embedding" collection

### Environment Setup
1. Ensure you're in the backend directory
2. Verify that .env file contains required credentials:
   - COHERE_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY (if required)

## Initial Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Verify Dependencies
Dependencies should already be installed from the embedding pipeline:
```bash
uv pip list | grep -E "(cohere|qdrant|python-dotenv)"
```

## Implementation

### 1. Create the retrieving.py file
Create a `retrieving.py` file with the retrieval implementation that includes all required functions:
- `retrieve`: Main retrieval function
- `query_qdrant`: Qdrant search wrapper
- `get_embedding`: Query embedding generation
- `format_json_response`: JSON response formatting
- `verify_content_accuracy`: Content validation

### 2. Run the Retrieval System
```bash
python retrieving.py
```

Or import and use the retrieve function in your application:
```python
from retrieving import retrieve

results = retrieve("your query text", top_k=5)
print(results)
```

## Configuration

### Default Parameters
- Top-k results: 5 (configurable)
- Similarity threshold: 0.0 (no minimum)
- Embedding model: embed-multilingual-v3.0
- Collection name: "rag_embedding"

## Expected Output
- Query text converted to embedding vector
- Similarity search performed in Qdrant
- Top-k most similar chunks returned with metadata
- Clean JSON response with content, URLs, positions, and similarity scores
- Performance metrics included in response

## Troubleshooting

### Common Issues
1. **Qdrant Connection**: Verify Qdrant URL and credentials in .env
2. **Cohere API Errors**: Check API key validity and quota limits
3. **No Results**: Ensure embeddings were previously stored in Qdrant

### Verification Steps
1. Check that embeddings exist in Qdrant collection
2. Verify environment variables are set correctly
3. Test with a simple query to confirm functionality