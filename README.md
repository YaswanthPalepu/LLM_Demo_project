# LLM_Demo_project

##Project Description

Help Assistant API is a full-stack intelligent support system designed to streamline IT help desk operations. It integrates a Python-based backend with a React-powered frontend to deliver a responsive and intuitive user experience. The backend leverages language models to interpret user queries and automate ticket handling, while the frontend provides a clean interface for users to interact with the assistant.

This project simulates a smart help desk assistant capable of managing service requests, incidents, password resets, and ticket statuses—all with natural language understanding and courteous, professional responses.

##Project Structure

HELP_ASSISTENT_API/
├── backend/
│   └── app/
│       ├── exception.py         # Handles custom exceptions
│       ├── llm_chain.py         # Core logic for language model interactions
│       ├── main.py              # API entry point
│       └── __pycache__/         # Python cache
├── frontend/
│   ├── node_modules/            # React dependencies
│   ├── public/                  # Static assets
│   ├── src/                     # React components and logic
│   │   ├── App.js               # Main application component
│   │   ├── index.js             # Entry point for rendering
│   │   └── ...                  # Supporting styles and tests
│   ├── package.json             # Project metadata and scripts
│   ├── .env                     # Environment variables
│   └── README.md                # Project documentation


##How It Works
###Input:

Users interact with the assistant via the frontend by typing natural language queries such as:

    “I need help with my printer”

    “Reset my password”

    “Check ticket #12345”

###Processing:

    The frontend sends the query to the backend API.

    The backend routes the request to llm_chain.py, which interprets the intent using a language model.

    Based on the intent, the system performs actions like creating tickets, sending password reset emails, or retrieving ticket statuses.

###Output:

    The assistant responds with a polite, professional message.

    Ticket statuses are tracked and updated during the session.

    Responses are tailored to the user’s query and follow help desk protocols.

##Importance of the Project

    This project demonstrates how AI can enhance IT support by:

    Reducing response time through automation

    Ensuring consistent and courteous communication

    Handling multiple help desk functions with minimal human intervention

    Providing a scalable solution for enterprise-level support systems
