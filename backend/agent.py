import os
import json
import logging
from typing import Dict, List, Any
from dotenv import load_dotenv
from agents import Agent, Runner
from agents import function_tool
import asyncio
import time

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@function_tool
def retrieve_information(query: str) -> Dict:
    """
    Retrieve information from the knowledge base based on a query
    """
    from retrieving import RAGRetriever
    retriever = RAGRetriever()

    try:
        # Call the existing retrieve method from the RAGRetriever instance
        json_response = retriever.retrieve(query_text=query, top_k=5, threshold=0.3)
        results = json.loads(json_response)

        # Format the results for the assistant
        formatted_results = []
        for result in results.get('results', []):
            formatted_results.append({
                'content': result['content'],
                'url': result['url'],
                'position': result['position'],
                'similarity_score': result['similarity_score']
            })

        return {
            'query': query,
            'retrieved_chunks': formatted_results,
            'total_results': len(formatted_results)
        }
    except Exception as e:
        logger.error(f"Error in retrieve_information: {e}")
        return {
            'query': query,
            'retrieved_chunks': [],
            'total_results': 0,
            'error': str(e)
        }

class RAGAgent:
    def __init__(self):
        # Create the agent with retrieval tool using the new OpenAI Agents SDK
        self.agent = Agent(
            name="RAG Assistant",
            instructions="You are a helpful assistant that answers questions based on retrieved documents. When asked a question, retrieve relevant documents first using the retrieve_information tool, then answer based on them. Always cite your sources and provide the information that was used to generate the answer.",
            tools=[retrieve_information]
        )

        logger.info("RAG Agent initialized with OpenAI Agents SDK")

    def query_agent(self, query_text: str) -> Dict:
        """
        Process a query through the RAG agent and return structured response
        """
        start_time = time.time()

        logger.info(f"Processing query through RAG agent: '{query_text[:50]}...'")

        try:
            # Run the agent with the query using the new OpenAI Agents SDK
            # Since Runner.run is async, we need to run it in an event loop
            import asyncio
            if asyncio.get_event_loop().is_running():
                # If we're already in an event loop, we need to use a different approach
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, self._async_query_agent(query_text))
                    result = future.result()
            else:
                result = asyncio.run(self._async_query_agent(query_text))

            return result

        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return {
                "answer": "Sorry, I encountered an error processing your request.",
                "sources": [],
                "matched_chunks": [],
                "error": str(e),
                "query_time_ms": (time.time() - start_time) * 1000
            }

    async def _async_query_agent(self, query_text: str) -> Dict:
        """
        Internal async method to run the agent query
        """
        start_time = time.time()

        try:
            result = await Runner.run(self.agent, query_text)

            # Extract the assistant's response
            assistant_response = result.final_output

            if not assistant_response:
                return {
                    "answer": "Sorry, I couldn't generate a response.",
                    "sources": [],
                    "matched_chunks": [],
                    "error": "No response from assistant",
                    "query_time_ms": (time.time() - start_time) * 1000
                }

            # Extract sources and matched chunks from the tool calls
            sources = set()
            matched_chunks = []

            # The new SDK might store tool call results differently
            # Let's try to access them in the most likely way based on the documentation
            if hasattr(result, 'final_output') and result.final_output:
                # If the result contains tool call results in final_output
                # For now, we'll rely on the agent's processing of the tool results
                # The agent itself will incorporate the tool results into the final response
                pass

            # Calculate query time
            query_time_ms = (time.time() - start_time) * 1000

            # Format the response
            # For the new SDK, we may need to extract the sources and chunks differently
            # based on how the agent processes the tool results
            response = {
                "answer": str(assistant_response),
                "sources": list(sources),
                "matched_chunks": matched_chunks,
                "query_time_ms": query_time_ms,
                "confidence": self._calculate_confidence(matched_chunks)
            }

            logger.info(f"Query processed in {query_time_ms:.2f}ms")
            return response

        except Exception as e:
            logger.error(f"Error in async query: {e}")
            raise

    def _calculate_confidence(self, matched_chunks: List[Dict]) -> str:
        """
        Calculate confidence level based on similarity scores and number of matches
        """
        if not matched_chunks:
            return "low"

        avg_score = sum(chunk.get('similarity_score', 0.0) for chunk in matched_chunks) / len(matched_chunks)

        if avg_score >= 0.7:
            return "high"
        elif avg_score >= 0.4:
            return "medium"
        else:
            return "low"

def query_agent(query_text: str) -> Dict:
    """
    Convenience function to query the RAG agent
    """
    agent = RAGAgent()
    return agent.query_agent(query_text)

def run_agent_sync(query_text: str) -> Dict:
    """
    Synchronous function to run the agent for direct usage
    """
    import asyncio

    async def run_async():
        agent = RAGAgent()
        return await agent._async_query_agent(query_text)

    # Check if there's already a running event loop
    try:
        loop = asyncio.get_running_loop()
        # If there's already a loop, run in a separate thread
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(asyncio.run, run_async())
            return future.result()
    except RuntimeError:
        # No running loop, safe to use asyncio.run
        return asyncio.run(run_async())

def main():
    """
    Main function to demonstrate the RAG agent functionality
    """
    logger.info("Initializing RAG Agent...")

    # Initialize the agent
    agent = RAGAgent()

    # Example queries to test the system
    test_queries = [
        "What is ROS2?",
        "Explain humanoid design principles",
        "How does VLA work?",
        "What are simulation techniques?",
        "Explain AI control systems"
    ]

    print("RAG Agent - Testing Queries")
    print("=" * 50)

    for i, query in enumerate(test_queries, 1):
        print(f"\nQuery {i}: {query}")
        print("-" * 30)

        # Process query through agent
        response = agent.query_agent(query)

        # Print formatted results
        print(f"Answer: {response['answer']}")

        if response.get('sources'):
            print(f"Sources: {len(response['sources'])} documents")
            for source in response['sources'][:3]:  # Show first 3 sources
                print(f"  - {source}")

        if response.get('matched_chunks'):
            print(f"Matched chunks: {len(response['matched_chunks'])}")
            for j, chunk in enumerate(response['matched_chunks'][:2], 1):  # Show first 2 chunks
                content_preview = chunk['content'][:100] + "..." if len(chunk['content']) > 100 else chunk['content']
                print(f"  Chunk {j}: {content_preview}")
                print(f"    Source: {chunk['url']}")
                print(f"    Score: {chunk['similarity_score']:.3f}")

        print(f"Query time: {response['query_time_ms']:.2f}ms")
        print(f"Confidence: {response.get('confidence', 'unknown')}")

        if i < len(test_queries):  # Don't sleep after the last query
            time.sleep(1)  # Small delay between queries

if __name__ == "__main__":
    main()