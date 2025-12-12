# Quickstart Guide: RAG Frontend Integration

## Prerequisites

### System Requirements
- Python 3.9 or higher
- Node.js and npm for Docusaurus development
- Existing backend project with RAG agent
- Access to OpenAI API (OPENAI_API_KEY in .env)
- Access to Cohere API (COHERE_API_KEY in .env)
- Access to Qdrant (QDRANT_URL and QDRANT_API_KEY in .env)

### Environment Setup
1. Ensure you have both backend and docusaurus_textbook directories
2. Verify that .env file contains required credentials:
   - OPENAI_API_KEY
   - COHERE_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY

## Initial Setup

### 1. Backend Setup (FastAPI)
```bash
cd backend
uv add "fastapi[all]" python-multipart
```

### 2. Create the FastAPI service
Create `api.py` in the backend directory with the RAG agent endpoint

### 3. Docusaurus Setup
Navigate to the docusaurus_textbook directory:
```bash
cd docusaurus_textbook
npm install
```

## Implementation

### 1. Create the FastAPI service (backend/api.py)
Create a FastAPI application that exposes the RAG agent functionality:
- POST /ask endpoint that accepts queries
- Response with answer, sources, and matched chunks
- Proper error handling and validation

### 2. Create the chat component (docusaurus_textbook/src/components/ChatWidget)
Create a React component that:
- Appears in the bottom-right corner of all pages
- Provides a chat interface for user queries
- Calls the backend API and displays responses
- Handles loading states and errors

### 3. Integrate the component into Docusaurus
Add the chat widget to the Docusaurus layout so it appears on all pages.

## Running the Application

### 1. Start the FastAPI backend
```bash
cd backend
uv run uvicorn api:app --reload --port 8000
```

### 2. Start the Docusaurus frontend
```bash
cd docusaurus_textbook
npm run start
```

### 3. Access the application
- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Backend endpoint: http://localhost:8000/ask

## Configuration

### Backend Configuration
- API port: 8000 (default)
- CORS allowed origins: localhost:3000 (for development)
- Request timeout: 30 seconds
- Rate limiting: 10 requests per minute per IP

### Frontend Configuration
- Widget position: Bottom-right corner (20px from bottom/right)
- Initial state: Closed (user must open)
- Message history: Stores last 50 messages in localStorage
- API endpoint: http://localhost:8000/ask (development)

## Expected Output
- Chat widget appears on all Docusaurus pages
- User can open the chat and enter queries
- Queries are sent to the backend RAG service
- Responses include answer, sources, and matched chunks
- Loading states and error handling work appropriately
- End-to-end functionality works in local development

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend allows requests from frontend origin
2. **API connection**: Verify backend is running on correct port
3. **Environment variables**: Check that all API keys are properly set
4. **Docusaurus integration**: Verify component is properly added to layout

### Verification Steps
1. Test backend API directly with curl or API client
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test with a simple query to confirm end-to-end functionality