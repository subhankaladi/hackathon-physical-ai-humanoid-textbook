# Data Model: RAG Retrieval Testing

## Query Request Entity

### Definition
Represents a user's text query that initiates the retrieval process.

### Fields
- **query_text** (string, required)
  - The user-provided text query
  - Input text that will be converted to embedding for similarity search
  - Maximum recommended size: 2000 characters

- **top_k** (integer, optional)
  - Number of results to return
  - Default value: 5
  - Maximum value: 20 (to prevent excessive response sizes)

- **threshold** (float, optional)
  - Minimum similarity score threshold for results
  - Range: 0.0 to 1.0
  - Default: 0.0 (no threshold)

- **include_metadata** (boolean, optional)
  - Whether to include detailed metadata in results
  - Default: true

### Validation Rules
- query_text must be non-empty
- top_k must be between 1 and 20
- threshold must be between 0.0 and 1.0

## Retrieved Chunk Entity

### Definition
Represents a document segment returned from Qdrant that matches the query, including content and metadata.

### Fields
- **content** (string, required)
  - The text content of the retrieved chunk
  - Original text content from the stored document
  - Maximum length depends on original chunking

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
  - Indicates confidence in relevance

- **chunk_id** (string, required)
  - Unique identifier for the chunk in Qdrant
  - UUID or hash identifier from Qdrant point ID
  - Used for reference and tracking

- **created_at** (datetime, required)
  - Timestamp when the chunk was originally stored
  - ISO 8601 format from original storage
  - Used for freshness validation

### Validation Rules
- similarity_score must be between 0.0 and 1.0
- content must be non-empty
- url must be a valid URL format
- position must be non-negative integer

## Query Response Entity

### Definition
JSON-formatted result containing retrieved chunks, metadata, and confidence scores.

### Fields
- **query** (string, required)
  - The original user query text
  - Echo of the input query for reference

- **results** (array[Retrieved Chunk], required)
  - Array of retrieved chunks ordered by similarity score
  - Contains up to top_k results that meet threshold criteria

- **metadata** (object, required)
  - Additional metadata about the retrieval operation
  - Contains timing and operational information

- **metadata.query_time_ms** (integer, required)
  - Time taken to execute the query in milliseconds
  - Used for performance monitoring

- **metadata.total_results** (integer, required)
  - Total number of results returned
  - May be less than requested top_k if few matches

- **metadata.timestamp** (datetime, required)
  - ISO 8601 timestamp when query was executed
  - For audit and monitoring purposes

### Validation Rules
- results array must contain between 0 and top_k elements
- query_time_ms must be non-negative
- total_results must match actual count of results

## Process Data Flow

### Input Data
- **Source**: User-provided query text
- **Format**: Plain text query
- **Validation**: Check for query length and format

### Processing Data
- **Query Embedding**: Query text converted to 1024-dim vector
- **Similarity Search**: Vector search against stored embeddings
- **Result Filtering**: Apply top_k and threshold filters

### Output Data
- **Retrieved Chunks**: Document segments with similarity scores
- **Metadata**: Source attribution and retrieval metrics
- **JSON Response**: Formatted response for client consumption

## State Transitions

### Retrieval Lifecycle
1. **Received**: Query text received from user
2. **Embedded**: Query converted to embedding vector
3. **Searched**: Similarity search performed in Qdrant
4. **Filtered**: Results filtered by top_k and threshold
5. **Formatted**: Results formatted into JSON response
6. **Returned**: Response delivered to user

## Constraints

### Size Constraints
- Query text length: < 2000 characters
- Top-k results: 1-20 range
- Individual chunk content: < 2000 characters (as per storage)

### Performance Constraints
- Query embedding generation time: < 2 seconds
- Qdrant search time: < 1 second for 95% of queries
- JSON formatting time: < 50ms

### Data Integrity
- Retrieved content must match stored original
- Similarity scores must be within 0.0-1.0 range
- All metadata fields must be present and valid