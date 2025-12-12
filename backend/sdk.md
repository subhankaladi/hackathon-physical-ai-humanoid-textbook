# OpenAI Agents SDK

The OpenAI Agents SDK is a lightweight Python framework for building production-ready agentic AI applications with minimal abstractions. It provides a streamlined upgrade from the experimental Swarm framework, offering essential primitives like agents with instructions and tools, handoffs for task delegation between agents, guardrails for input/output validation, and sessions for automatic conversation history management. The SDK emphasizes ease of use while maintaining enough power to express complex multi-agent relationships, making it suitable for real-world applications without requiring mastery of complex frameworks.

Built on core design principles of simplicity and customization, the SDK includes an automatic agent loop handling tool calls and LLM interactions, Python-first orchestration without new abstractions to learn, built-in tracing for visualization and debugging, and automatic schema generation with Pydantic validation for function tools. It supports multiple model providers through OpenAI's Responses API and Chat Completions API, with native integration for LiteLLM and custom providers. Whether building single-agent assistants or complex multi-agent workflows with specialized roles, the SDK provides the necessary features to move quickly from prototype to production.

## Installation and Setup

Install the SDK and configure your environment

```bash
pip install openai-agents

export OPENAI_API_KEY=sk-...
```

## Creating a Basic Agent

Define an agent with name and instructions

```python
from agents import Agent, Runner

agent = Agent(
    name="Math Tutor",
    instructions="You provide help with math problems. Explain your reasoning at each step and include examples"
)

result = Runner.run_sync(agent, "What is 15% of 80?")
print(result.final_output)
# 15% of 80 is 12. To calculate: 0.15 × 80 = 12
```

## Running Agents Asynchronously

Execute agent with async/await pattern

```python
import asyncio
from agents import Agent, Runner

async def main():
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely."
    )

    result = await Runner.run(agent, "What city is the Golden Gate Bridge in?")
    print(result.final_output)
    # San Francisco

asyncio.run(main())
```

## Agent with Function Tools

Decorate Python functions to create tools with automatic schema generation

```python
from agents import Agent, Runner, function_tool
import asyncio

@function_tool
async def get_weather(city: str) -> str:
    """Fetch the weather for a given location.

    Args:
        city: The city to fetch weather for.
    """
    # In production, call actual weather API
    return f"The weather in {city} is sunny and 72°F"

@function_tool
def calculate_sum(a: int, b: int) -> int:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return a + b

agent = Agent(
    name="Assistant",
    instructions="Use the provided tools to help the user",
    tools=[get_weather, calculate_sum]
)

async def main():
    result = await Runner.run(agent, "What's the weather in Seattle?")
    print(result.final_output)
    # The weather in Seattle is sunny and 72°F

asyncio.run(main())
```

## Agent with Hosted Tools

Use OpenAI's built-in tools for web search and file retrieval

```python
from agents import Agent, Runner, WebSearchTool, FileSearchTool
import asyncio

agent = Agent(
    name="Research Assistant",
    instructions="Use web search and file search to answer questions thoroughly",
    tools=[
        WebSearchTool(),
        FileSearchTool(
            max_num_results=5,
            vector_store_ids=["vs_abc123"]
        )
    ]
)

async def main():
    result = await Runner.run(
        agent,
        "What are the latest developments in quantum computing?"
    )
    print(result.final_output)

asyncio.run(main())
```

## Multi-Agent Handoffs

Create specialized agents that delegate to each other

```python
from agents import Agent, Runner
import asyncio

billing_agent = Agent(
    name="Billing Agent",
    handoff_description="Specialist for billing questions and payment issues",
    instructions="You handle billing inquiries. Check account status and process refunds."
)

technical_agent = Agent(
    name="Technical Agent",
    handoff_description="Specialist for technical support and troubleshooting",
    instructions="You handle technical issues. Diagnose problems and provide solutions."
)

triage_agent = Agent(
    name="Triage Agent",
    instructions=(
        "Determine which specialist agent should handle the user's request. "
        "Hand off to the appropriate agent based on the question type."
    ),
    handoffs=[billing_agent, technical_agent]
)

async def main():
    result = await Runner.run(
        triage_agent,
        "I was charged twice for my subscription this month"
    )
    print(result.final_output)
    # Output from billing_agent after handoff

asyncio.run(main())
```

## Custom Handoff with Input Data

Configure handoffs with structured input and callbacks

```python
from agents import Agent, Runner, handoff, RunContextWrapper
from pydantic import BaseModel
import asyncio

class EscalationData(BaseModel):
    reason: str
    severity: str

async def on_escalation(ctx: RunContextWrapper[None], input_data: EscalationData):
    print(f"Escalated: {input_data.reason} (severity: {input_data.severity})")
    # Log to monitoring system, send alert, etc.

escalation_agent = Agent(
    name="Manager",
    instructions="Handle escalated customer issues with priority"
)

support_agent = Agent(
    name="Support Agent",
    instructions="Help customers. Escalate to manager if issue is severe.",
    handoffs=[
        handoff(
            agent=escalation_agent,
            on_handoff=on_escalation,
            input_type=EscalationData,
            tool_description_override="Escalate urgent issues to management"
        )
    ]
)

async def main():
    result = await Runner.run(
        support_agent,
        "This is completely unacceptable! I demand to speak to a manager!"
    )
    print(result.final_output)

asyncio.run(main())
```

## Input Guardrails

Validate user input before processing with the main agent

```python
from agents import Agent, Runner, input_guardrail, GuardrailFunctionOutput
from agents import InputGuardrailTripwireTriggered, RunContextWrapper, TResponseInputItem
from pydantic import BaseModel
import asyncio

class HomeworkCheck(BaseModel):
    is_homework: bool
    reasoning: str

guardrail_agent = Agent(
    name="Homework Detector",
    instructions="Determine if the user is asking for homework help",
    output_type=HomeworkCheck
)

@input_guardrail
async def homework_guardrail(
    ctx: RunContextWrapper[None],
    agent: Agent,
    input_data: str | list[TResponseInputItem]
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_homework
    )

tutoring_agent = Agent(
    name="Tutoring Service",
    instructions="You help students understand concepts, not do their homework",
    input_guardrails=[homework_guardrail]
)

async def main():
    try:
        result = await Runner.run(
            tutoring_agent,
            "Can you solve this equation for me: 2x + 5 = 15?"
        )
        print(result.final_output)
    except InputGuardrailTripwireTriggered as e:
        print("Request blocked: This appears to be homework help")

asyncio.run(main())
```

## Output Guardrails

Validate agent responses before returning to user

```python
from agents import Agent, Runner, output_guardrail, GuardrailFunctionOutput
from agents import OutputGuardrailTripwireTriggered, RunContextWrapper
from pydantic import BaseModel
import asyncio

class ToxicityCheck(BaseModel):
    is_toxic: bool
    confidence: float

class AgentResponse(BaseModel):
    message: str

toxicity_checker = Agent(
    name="Toxicity Detector",
    instructions="Analyze if the message contains toxic or harmful content",
    output_type=ToxicityCheck
)

@output_guardrail
async def toxicity_guardrail(
    ctx: RunContextWrapper[None],
    agent: Agent,
    output: AgentResponse
) -> GuardrailFunctionOutput:
    result = await Runner.run(toxicity_checker, output.message, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_toxic and result.final_output.confidence > 0.8
    )

chatbot = Agent(
    name="Chatbot",
    instructions="You are a friendly assistant",
    output_guardrails=[toxicity_guardrail],
    output_type=AgentResponse
)

async def main():
    try:
        result = await Runner.run(chatbot, "Tell me about your day")
        print(result.final_output.message)
    except OutputGuardrailTripwireTriggered:
        print("Response blocked by content filter")

asyncio.run(main())
```

## Sessions for Conversation Memory

Automatically maintain conversation history across multiple turns

```python
from agents import Agent, Runner, SQLiteSession
import asyncio

async def main():
    agent = Agent(
        name="Assistant",
        instructions="Reply concisely and remember previous context"
    )

    # Create persistent session with SQLite backend
    session = SQLiteSession("user_123", "conversations.db")

    # First turn
    result = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
        session=session
    )
    print(result.final_output)
    # San Francisco

    # Second turn - agent remembers previous context
    result = await Runner.run(
        agent,
        "What state is it in?",
        session=session
    )
    print(result.final_output)
    # California

    # Third turn - continuing the conversation
    result = await Runner.run(
        agent,
        "What's the population?",
        session=session
    )
    print(result.final_output)
    # Approximately 39 million

asyncio.run(main())
```

## Session Management Operations

Manipulate conversation history programmatically

```python
from agents import Agent, Runner, SQLiteSession
import asyncio

async def main():
    session = SQLiteSession("conversation_456", "chats.db")

    # Get all conversation items
    items = await session.get_items()
    print(f"Total messages: {len(items)}")

    # Add items manually
    await session.add_items([
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi! How can I help?"}
    ])

    # Remove last item (useful for corrections)
    agent = Agent(name="Assistant")

    result = await Runner.run(agent, "What's 2 + 2?", session=session)
    print(result.final_output)

    # User wants to correct their question
    await session.pop_item()  # Remove assistant response
    await session.pop_item()  # Remove user question

    result = await Runner.run(agent, "What's 2 + 3?", session=session)
    print(result.final_output)

    # Clear entire session
    await session.clear_session()

asyncio.run(main())
```

## OpenAI Conversations Session

Use OpenAI-hosted conversation storage

```python
from agents import Agent, Runner, OpenAIConversationsSession
import asyncio

async def main():
    agent = Agent(name="Assistant")

    # Create new conversation or resume existing one
    session = OpenAIConversationsSession()
    # Or with existing conversation ID:
    # session = OpenAIConversationsSession(conversation_id="conv_abc123")

    result = await Runner.run(
        agent,
        "Remember that my favorite color is blue",
        session=session
    )

    # Later conversation with same session
    result = await Runner.run(
        agent,
        "What's my favorite color?",
        session=session
    )
    print(result.final_output)
    # Your favorite color is blue

asyncio.run(main())
```

## Structured Outputs

Force agents to return specific data types with validation

```python
from agents import Agent, Runner
from pydantic import BaseModel
import asyncio

class CalendarEvent(BaseModel):
    title: str
    date: str
    participants: list[str]
    location: str | None = None

agent = Agent(
    name="Calendar Parser",
    instructions="Extract calendar event information from text",
    output_type=CalendarEvent
)

async def main():
    text = "Schedule a team meeting on March 15th with John, Sarah, and Mike"
    result = await Runner.run(agent, text)

    event = result.final_output_as(CalendarEvent)
    print(f"Event: {event.title}")
    print(f"Date: {event.date}")
    print(f"Attendees: {', '.join(event.participants)}")
    # Event: Team Meeting
    # Date: March 15th
    # Attendees: John, Sarah, Mike

asyncio.run(main())
```

## Agent Context and Dependency Injection

Pass custom context objects to agents and tools

```python
from dataclasses import dataclass
from agents import Agent, Runner, RunContextWrapper, function_tool
import asyncio

@dataclass
class UserContext:
    user_id: str
    is_premium: bool
    api_token: str

@function_tool
async def get_user_data(ctx: RunContextWrapper[UserContext]) -> str:
    """Fetch user-specific data using context."""
    user_id = ctx.context.user_id
    is_premium = ctx.context.is_premium

    if is_premium:
        return f"Premium user {user_id} has access to all features"
    return f"User {user_id} has basic access"

agent = Agent[UserContext](
    name="Account Manager",
    instructions="Provide user information based on their account status",
    tools=[get_user_data]
)

async def main():
    context = UserContext(
        user_id="user_789",
        is_premium=True,
        api_token="secret_token"
    )

    result = await Runner.run(agent, "What's my account status?", context=context)
    print(result.final_output)

asyncio.run(main())
```

## Dynamic Instructions

Generate agent instructions at runtime based on context

```python
from agents import Agent, Runner, RunContextWrapper
from dataclasses import dataclass
import asyncio

@dataclass
class AppContext:
    username: str
    language: str
    timezone: str

def dynamic_instructions(
    context: RunContextWrapper[AppContext],
    agent: Agent[AppContext]
) -> str:
    user = context.context
    return f"""You are a helpful assistant for {user.username}.
    - Respond in {user.language}
    - Use {user.timezone} timezone for all time references
    - Be friendly and personalized"""

agent = Agent[AppContext](
    name="Personal Assistant",
    instructions=dynamic_instructions
)

async def main():
    context = AppContext(
        username="Alice",
        language="Spanish",
        timezone="PST"
    )

    result = await Runner.run(agent, "What time is it?", context=context)
    print(result.final_output)

asyncio.run(main())
```

## Streaming Agent Responses

Stream token-by-token responses from the agent

```python
from agents import Agent, Runner
from openai.types.responses import ResponseTextDeltaEvent
import asyncio

async def main():
    agent = Agent(
        name="Storyteller",
        instructions="Tell engaging short stories"
    )

    result = Runner.run_streamed(agent, "Tell me a story about a robot")

    print("Streaming response: ", end="", flush=True)
    async for event in result.stream_events():
        if event.type == "raw_response_event":
            if isinstance(event.data, ResponseTextDeltaEvent):
                print(event.data.delta, end="", flush=True)

    print("\n\nFinal output:", result.final_output)

asyncio.run(main())
```

## Streaming with Item-Level Events

Stream higher-level events like tool calls and messages

```python
from agents import Agent, Runner, ItemHelpers, function_tool
import asyncio
import random

@function_tool
def roll_dice(sides: int = 6) -> int:
    """Roll a dice with specified number of sides."""
    return random.randint(1, sides)

async def main():
    agent = Agent(
        name="Game Master",
        instructions="Use the dice rolling tool when asked",
        tools=[roll_dice]
    )

    result = Runner.run_streamed(agent, "Roll two dice for me")

    async for event in result.stream_events():
        if event.type == "raw_response_event":
            continue  # Skip token-level events
        elif event.type == "agent_updated_stream_event":
            print(f"Agent: {event.new_agent.name}")
        elif event.type == "run_item_stream_event":
            if event.item.type == "tool_call_item":
                print("🔧 Tool called")
            elif event.item.type == "tool_call_output_item":
                print(f"📤 Tool result: {event.item.output}")
            elif event.item.type == "message_output_item":
                text = ItemHelpers.text_message_output(event.item)
                print(f"💬 Agent: {text}")

asyncio.run(main())
```

## Agents as Tools Pattern

Use specialized agents as tools in a central orchestrator

```python
from agents import Agent, Runner
import asyncio

translation_agent = Agent(
    name="Translator",
    instructions="Translate the user's message to the specified language"
)

summarization_agent = Agent(
    name="Summarizer",
    instructions="Create a concise summary of the provided text"
)

orchestrator = Agent(
    name="Orchestrator",
    instructions="Use the available tools to process user requests efficiently",
    tools=[
        translation_agent.as_tool(
            tool_name="translate_text",
            tool_description="Translate text to another language"
        ),
        summarization_agent.as_tool(
            tool_name="summarize_text",
            tool_description="Generate a summary of long text"
        )
    ]
)

async def main():
    result = await Runner.run(
        orchestrator,
        "Translate 'Hello, how are you?' to French and Spanish"
    )
    print(result.final_output)

asyncio.run(main())
```

## Custom Model Configuration

Configure model settings and use different models per agent

```python
from agents import Agent, Runner, ModelSettings
from openai.types.shared import Reasoning
import asyncio

reasoning_agent = Agent(
    name="Deep Thinker",
    instructions="Analyze complex problems thoroughly",
    model="gpt-5",
    model_settings=ModelSettings(
        reasoning=Reasoning(effort="high"),
        temperature=0.7,
        verbosity="high"
    )
)

fast_agent = Agent(
    name="Quick Responder",
    instructions="Provide rapid responses",
    model="gpt-5-nano",
    model_settings=ModelSettings(
        reasoning=Reasoning(effort="minimal"),
        temperature=0.3,
        verbosity="low"
    )
)

triage_agent = Agent(
    name="Router",
    instructions="Route complex problems to deep thinker, simple ones to quick responder",
    handoffs=[reasoning_agent, fast_agent]
)

async def main():
    result = await Runner.run(
        triage_agent,
        "Explain quantum entanglement in simple terms"
    )
    print(result.final_output)

asyncio.run(main())
```

## MCP Hosted Tool Integration

Use Model Context Protocol servers as hosted tools

```python
from agents import Agent, Runner, HostedMCPTool
import asyncio

async def main():
    agent = Agent(
        name="Code Assistant",
        instructions="Help with repository questions using git tools",
        tools=[
            HostedMCPTool(
                tool_config={
                    "type": "mcp",
                    "server_label": "gitmcp",
                    "server_url": "https://gitmcp.io/openai/codex",
                    "require_approval": "never"
                }
            )
        ]
    )

    result = await Runner.run(
        agent,
        "What programming languages are used in this repository?"
    )
    print(result.final_output)

asyncio.run(main())
```

## MCP Server with Streamable HTTP

Connect to local or remote MCP servers via HTTP

```python
from agents import Agent, Runner, ModelSettings
from agents.mcp import MCPServerStreamableHttp
import asyncio
import os

async def main():
    token = os.environ["MCP_SERVER_TOKEN"]

    async with MCPServerStreamableHttp(
        name="Calculator Server",
        params={
            "url": "http://localhost:8000/mcp",
            "headers": {"Authorization": f"Bearer {token}"},
            "timeout": 10
        },
        cache_tools_list=True,
        max_retry_attempts=3
    ) as server:
        agent = Agent(
            name="Math Assistant",
            instructions="Use MCP tools to perform calculations",
            mcp_servers=[server],
            model_settings=ModelSettings(tool_choice="required")
        )

        result = await Runner.run(agent, "Calculate 47 + 89")
        print(result.final_output)

asyncio.run(main())
```

## MCP stdio Server

Launch local MCP server processes

```python
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
from pathlib import Path
import asyncio

async def main():
    samples_dir = Path(__file__).parent / "sample_files"

    async with MCPServerStdio(
        name="Filesystem Server",
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", str(samples_dir)]
        }
    ) as server:
        agent = Agent(
            name="File Assistant",
            instructions="Help users work with files in the sample directory",
            mcp_servers=[server]
        )

        result = await Runner.run(agent, "List all files in the directory")
        print(result.final_output)

asyncio.run(main())
```

## Tracing and Monitoring

Built-in tracing for debugging and monitoring agent workflows

```python
from agents import Agent, Runner, trace
import asyncio

async def main():
    agent = Agent(
        name="Research Agent",
        instructions="Research topics thoroughly"
    )

    # Trace multiple runs under single workflow
    with trace(
        workflow_name="Research Workflow",
        group_id="session_123",
        metadata={"user": "alice", "environment": "production"}
    ):
        result1 = await Runner.run(agent, "What is machine learning?")
        print(f"Response 1: {result1.final_output}")

        result2 = await Runner.run(agent, "Explain neural networks")
        print(f"Response 2: {result2.final_output}")

    # View traces at: https://platform.openai.com/traces

asyncio.run(main())
```

## Error Handling

Handle exceptions from agent runs, guardrails, and tool failures

```python
from agents import Agent, Runner, function_tool
from agents.exceptions import (
    MaxTurnsExceeded,
    InputGuardrailTripwireTriggered,
    ModelBehaviorError
)
import asyncio

@function_tool
def risky_operation() -> str:
    """An operation that might fail."""
    raise ValueError("Operation failed!")

agent = Agent(
    name="Assistant",
    instructions="Help users with tasks",
    tools=[risky_operation]
)

async def main():
    try:
        result = await Runner.run(
            agent,
            "Run the risky operation",
            max_turns=5
        )
        print(result.final_output)

    except MaxTurnsExceeded:
        print("Error: Agent exceeded maximum turns")
    except InputGuardrailTripwireTriggered as e:
        print(f"Error: Input blocked by guardrail: {e}")
    except ModelBehaviorError as e:
        print(f"Error: Model produced invalid output: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

asyncio.run(main())
```

## Using Alternative Model Providers

Integrate non-OpenAI models via LiteLLM

```bash
pip install "openai-agents[litellm]"
```

```python
from agents import Agent, Runner
import asyncio

async def main():
    # Use Claude via LiteLLM
    claude_agent = Agent(
        name="Claude Assistant",
        instructions="You are a helpful assistant",
        model="litellm/anthropic/claude-3-5-sonnet-20240620"
    )

    # Use Gemini via LiteLLM
    gemini_agent = Agent(
        name="Gemini Assistant",
        instructions="You are a helpful assistant",
        model="litellm/gemini/gemini-2.5-flash-preview-04-17"
    )

    result = await Runner.run(claude_agent, "Explain photosynthesis briefly")
    print(result.final_output)

asyncio.run(main())
```

---

## Summary

The OpenAI Agents SDK provides a comprehensive yet simple framework for building agentic AI applications in Python. Core use cases include single-agent assistants with tool access, multi-agent systems with specialized roles using handoffs, conversational applications with automatic session memory, and workflows with input/output validation via guardrails. The SDK excels at building customer service bots with agent routing, research assistants with web search and file retrieval, code generation tools with MCP integration, and any application requiring LLM orchestration with minimal boilerplate.

Integration patterns follow Python-first principles using native async/await, context managers for resource handling, decorators for function tools, and Pydantic models for structured outputs. The framework supports horizontal scaling through session persistence with SQLite or SQLAlchemy backends, vertical scaling with model mixing (fast models for triage, powerful models for complex tasks), and comprehensive observability through built-in tracing to OpenAI's dashboard or custom processors. Whether building prototypes or production systems, the SDK's balance of simplicity and power makes it an ideal choice for Python developers working with AI agents.
