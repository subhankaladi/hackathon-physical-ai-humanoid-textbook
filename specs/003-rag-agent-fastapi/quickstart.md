# Quickstart Guide: RAG Agent with OpenAI Agents SDK

## Prerequisites

### System Requirements
- Python 3.9 or higher
- Existing backend project with UV package manager
- Access to OpenAI API (OPENAI_API_KEY in .env)
- Access to Cohere API (same credentials as embedding pipeline)
- Access to Qdrant (same instance used for storage)
- Previously stored embeddings in "rag_embedding" collection
- Existing retrieving.py module with retrieval functionality

### Environment Setup
1. Ensure you're in the backend directory
2. Verify that .env file contains required credentials:
   - OPENAI_API_KEY
   - COHERE_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY (if required)

## Initial Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
Add OpenAI to your existing dependencies:
```bash
uv add openai
```

### 3. Verify Existing Components
Ensure the following components are available:
- retrieving.py with working retrieve function
- .env file with API keys
- Qdrant collection with stored embeddings

## Implementation

### 1. Create the agent.py file
Create a `agent.py` file with the agent implementation that includes:
- OpenAI Assistant creation with retrieval tool
- Tool function that wraps existing retrieve functionality
- Main query processing function
- Response formatting

### 2. Run the Agent System
```bash
python agent.py
```

Or import and use the agent function in your application:
```python
from agent import query_agent

results = query_agent("your query text")
print(results)
```

## Configuration

### Default Parameters
- OpenAI Model: gpt-4-turbo (or latest suitable model)
- Retrieval top-k: 5 results
- Similarity threshold: 0.3 (adjustable)
- Agent instructions: RAG-focused behavior

## Expected Output
- Query processed by OpenAI agent
- Agent decides whether to retrieve information
- Relevant content fetched from Qdrant when needed
- Answer generated based on retrieved content
- Response includes answer, sources, and matched chunks
- Clean JSON output with proper formatting

## Troubleshooting

### Common Issues
1. **OpenAI API Errors**: Verify OPENAI_API_KEY in .env file
2. **Qdrant Connection**: Verify Qdrant URL and credentials in .env
3. **Cohere API Errors**: Check Cohere API key validity
4. **No Results**: Ensure embeddings were previously stored in Qdrant

### Verification Steps
1. Check that all API keys are properly configured
2. Verify that retrieving.py works independently
3. Test with a simple query to confirm agent functionality