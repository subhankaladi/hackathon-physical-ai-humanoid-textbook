# Data Model: RAG Frontend Integration

## Query Request Entity

### Definition
Represents a user's text query sent from the frontend to the backend API.

### Fields
- **query** (string, required)
  - The user's question text
  - Input text that will be processed by the RAG agent
  - Maximum length: 2000 characters to prevent abuse
  - Should be sanitized to prevent injection attacks

### Validation Rules
- query must be non-empty
- query length must be between 1 and 2000 characters
- query must be properly sanitized

## Query Response Entity

### Definition
JSON response from the backend containing answer, sources, and matched chunks.

### Fields
- **answer** (string, required)
  - The generated answer from the RAG agent
  - Response text with information synthesized from retrieved documents
  - May be empty if no relevant results found

- **sources** (array[string], required)
  - List of source URLs used to generate the answer
  - Unique URLs from which content was retrieved
  - Used for source attribution and verification

- **matched_chunks** (array[object], required)
  - Content chunks that informed the answer
  - Each chunk includes content, URL, position, and similarity score
  - Provides transparency about information used

- **error** (string, optional)
  - Error message if the request failed
  - Present when status indicates error
  - Human-readable error description

- **status** (string, required)
  - Current status of the request (success, error, empty)
  - Used for frontend state management
  - Values: "success", "error", "empty"

### Validation Rules
- answer must be present when status is "success"
- sources array should not contain duplicates
- matched_chunks should have meaningful content when available
- error must be present when status is "error"

## Matched Chunk Entity

### Definition
Individual content chunk that informed the RAG agent's answer.

### Fields
- **content** (string, required)
  - The text content of the retrieved chunk
  - Original text content from the stored document
  - May be truncated for display purposes

- **url** (string, required)
  - Source URL of the content
  - Full URL where the original content was extracted from
  - Used for attribution and reference

- **position** (integer, required)
  - Position of chunk in original document
  - Zero-based index indicating order in document
  - Enables reconstruction of document order

- **similarity_score** (float, required)
  - Cosine similarity score between query and chunk
  - Range: 0.0 to 1.0 (higher is more similar)
  - Indicates relevance of chunk to query

### Validation Rules
- similarity_score must be between 0.0 and 1.0
- content must be non-empty
- url must be a valid URL format
- position must be non-negative integer

## UI State Entity

### Definition
Current state of the chat interface for frontend management.

### Fields
- **isOpen** (boolean, required)
  - Whether the chat widget is currently open or closed
  - Controls visibility of the chat interface
  - Defaults to false (closed)

- **isLoading** (boolean, required)
  - Whether the system is currently processing a query
  - Controls display of loading indicators
  - Used for user feedback during processing

- **error** (string, optional)
  - Current error message if any
  - Displayed to user when error occurs
  - Cleared when new query is submitted

- **messages** (array[object], required)
  - History of messages in the current chat session
  - Contains both user queries and AI responses
  - Maintains conversation context

### Validation Rules
- When isLoading is true, no new queries should be accepted
- Messages should be properly formatted with sender and content
- Error should be cleared when new action is taken

## Message Entity

### Definition
Individual message in the chat history.

### Fields
- **id** (string, required)
  - Unique identifier for the message
  - Used for React key and tracking
  - Generated as UUID or timestamp

- **sender** (string, required)
  - Who sent the message ("user" or "ai")
  - Used for styling and differentiation
  - Values: "user", "ai"

- **content** (string, required)
  - The text content of the message
  - Either user query or AI response
  - May include formatted response data

- **timestamp** (datetime, required)
  - When the message was created
  - ISO 8601 format
  - Used for ordering and display

- **sources** (array[string], optional)
  - Sources for AI-generated responses
  - Only present in AI messages
  - Used for source attribution display

### Validation Rules
- sender must be either "user" or "ai"
- content must be non-empty
- timestamp must be in valid ISO format
- sources should only be present in AI messages

## Process Data Flow

### Input Data
- **Source**: User-entered query in chat interface
- **Format**: Plain text query
- **Validation**: Length and content validation

### Processing Data
- **API Request**: POST request to backend /ask endpoint
- **Agent Processing**: RAG agent processes query with retrieval
- **Response Generation**: Answer, sources, and chunks compiled

### Output Data
- **API Response**: JSON with answer, sources, and chunks
- **UI Update**: Chat interface updates with new message
- **State Management**: Loading states and error handling

## State Transitions

### Chat Lifecycle
1. **Idle**: Chat widget closed, no interaction
2. **Opened**: Chat widget opened, ready for input
3. **Querying**: User submitted query, waiting for response
4. **Loading**: Backend processing query
5. **Response**: Response received, displayed to user
6. **Error**: Error occurred, error message displayed

## Constraints

### Size Constraints
- Query length: 1-2000 characters
- Answer length: < 4000 characters (to stay within token limits)
- Message history: Limit to 50 most recent messages

### Performance Constraints
- API response time: < 10 seconds for 95% of requests
- UI update time: < 100ms for user interactions
- Initial load time: < 2 seconds for chat widget

### Data Integrity
- Sources must be properly attributed
- Answer must be grounded in retrieved content
- Error messages must be user-friendly