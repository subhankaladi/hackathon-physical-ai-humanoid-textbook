# Research Document: RAG Agent with OpenAI Agents SDK

## 1. OpenAI Agents SDK Research

### Decision: Use OpenAI Assistant API with Retrieval Tool
- Use the OpenAI Assistant API rather than a separate "Agents SDK" (which doesn't exist as a separate package)
- Create an Assistant with a custom tool that enables the agent to retrieve information from Qdrant
- Use the existing OpenAI Python SDK (openai>=1.0)

### Rationale:
- OpenAI's agent functionality is provided through the Assistant API
- The Assistant API supports custom tools that can be used for retrieval
- This approach allows the agent to make decisions about when to retrieve information

### Implementation approach:
```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create an assistant with custom tools
assistant = client.beta.assistants.create(
    name="RAG Assistant",
    instructions="You are a helpful assistant that answers questions based on retrieved documents. When asked a question, retrieve relevant documents first, then answer based on them.",
    model="gpt-4-turbo",  # or another suitable model
    tools=[{
        "type": "function",
        "function": {
            "name": "retrieve_information",
            "description": "Retrieve information from the knowledge base based on a query",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The query to search for in the knowledge base"}
                },
                "required": ["query"]
            }
        }
    }]
)
```

## 2. RAG Integration Research

### Decision: Use Function Calling for Retrieval
- Implement the retrieval functionality as a function that the assistant can call
- The assistant will decide when to call the retrieval function based on the user query
- After retrieval, the assistant will generate an answer based on the retrieved content

### Rationale:
- Function calling allows for dynamic retrieval decisions
- Maintains the conversational flow of the assistant
- Provides flexibility in how retrieved information is used

### Implementation approach:
- Create a function that wraps the existing retrieve functionality
- Register this function as an available tool for the assistant
- The assistant will call this function when it needs to retrieve information

## 3. Tool Integration Research

### Decision: Create Custom Retrieval Tool Using Existing Function
- Reuse the retrieve function from retrieving.py as the basis for the tool
- Create a wrapper function that matches the expected function calling format
- Ensure the tool returns structured data that the assistant can understand

### Rationale:
- Reusing existing code reduces duplication and maintenance
- The existing retrieve function already handles Qdrant integration
- Maintains consistency with the existing retrieval approach

### Implementation approach:
```python
def retrieve_information(query: str) -> Dict:
    # Import the existing retrieve function
    from retrieving import retrieve

    # Call the retrieve function with appropriate parameters
    json_response = retrieve(query_text=query, top_k=5, threshold=0.3)
    results = json.loads(json_response)

    # Format the results for the assistant
    formatted_results = []
    for result in results.get('results', []):
        formatted_results.append({
            'content': result['content'],
            'url': result['url'],
            'similarity_score': result['similarity_score']
        })

    return {
        'query': query,
        'retrieved_chunks': formatted_results,
        'total_results': len(formatted_results)
    }
```

## 4. Error Handling Research

### Decision: Implement Comprehensive Error Handling
- Handle API errors from OpenAI
- Handle retrieval errors from Qdrant/Cohere
- Provide graceful degradation when services are unavailable
- Return meaningful error messages to users

### Rationale:
- Ensures robust operation in production environments
- Provides good user experience during partial failures
- Maintains system reliability

### Implementation approach:
- Use try-catch blocks around all external API calls
- Implement fallback responses when retrieval fails
- Log errors for debugging while providing user-friendly messages
- Include retry logic for transient failures

## 5. Response Formatting Research

### Decision: Format Responses with Answer, Sources, and Chunks
- Ensure the final response includes the generated answer
- Include source attribution for transparency
- Provide access to the matched chunks that informed the answer
- Return in clean JSON format

### Rationale:
- Meets the success criteria specified in the requirements
- Provides transparency about information sources
- Enables downstream processing of the response

### Implementation approach:
- Structure the response with clear separation of answer, sources, and chunks
- Include metadata like confidence levels and retrieval time
- Maintain consistency with existing response formats