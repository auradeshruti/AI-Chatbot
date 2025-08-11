# Local AI Chatbot

A full-stack local AI chatbot built with **Next.js** (frontend), **Node.js + Express** (backend), **PostgreSQL** (database), and **Ollama** (Gemma model).  
Supports **chat history**, **retry**, **stop**, and **delete chat** features, with **persistent storage**.

---

## * Features
- Local AI responses using **Ollama (Gemma model)**  
- Chat history stored in **PostgreSQL** and displayed in the sidebar  
- **Retry**, **Stop**, and **Delete Chat** features  
- Auto-generated chat titles based on the first message  
- Streaming & Stop support with **AbortController**  
- Responsive UI with **Tailwind CSS**  

---



## * Installation & Setup

### 1️. Clone Repository
git clone https://github.com/your-username/local-ai-chatbot.git
cd local-ai-chatbot

### 2️. Backend Setup
cd backend
npm install

**Create a PostgreSQL database (e.g., chatbot_db):**
- CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

- CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT,
    content TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

**Create `.env` file in backend:**
PGUSER=postgres
PGHOST=localhost
PGDATABASE=chatbot_db
PGPASSWORD=your_password
PGPORT=5432

---

### 3️. Start Ollama (Gemma Model)
ollama run gemma:2b

---

### 4️. Start Backend
node index.js
Backend runs at: http://localhost:3001

---

### 5️. Frontend Setup
cd ../frontend
npm install
npm run dev
Frontend runs at: http://localhost:3000

---

## * API Endpoints

Method   | Endpoint                    | Description
---------|-----------------------------|----------------------------------
POST     | /api/chat                    | Create a new chat
POST     | /api/chat/:chatId/message    | Send message & get AI reply
GET      | /api/chats                   | Get all chats
GET      | /api/chat/:chatId            | Get messages for a chat
DELETE   | /api/chat/:chatId            | Delete chat

---

## * Notes
- Do NOT upload `node_modules` to GitHub. Install dependencies using:  
  npm install
- Ensure **Ollama** is running before sending messages.
- If **Next.js frontend** gets stuck loading, delete the `.next` folder:  
  Remove-Item -Recurse -Force .next
