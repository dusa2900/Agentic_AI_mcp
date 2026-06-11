# Carpooling Platform - Complete Workflow Documentation

This folder contains comprehensive documentation about the Carpooling Platform architecture, workflows, and usage guidelines.

## 📚 Documentation Contents

### 1. [ARCHITECTURE.md](./ARCHITECTURE.md)
Complete system architecture documentation including:
- System overview and components
- Technology stack
- Data models and database schema
- Frontend architecture (React + TypeScript)
- Backend architecture (Node.js + Express + PostgreSQL)
- MCP (Model Context Protocol) implementation
- Authentication and security

### 2. [WORKFLOWS.md](./WORKFLOWS.md)
Detailed workflow diagrams covering:
- User authentication flow
- Route publishing workflow
- Seat booking workflow
- Comment/chat system flow
- MCP agent workflow
- Development workflow (SDLC)
- Data flow diagrams

### 3. [HOW_TO_USE.md](./HOW_TO_USE.md)
Comprehensive usage guide answering:
- **What** is this platform?
- **Why** use it?
- **When** to use each feature?
- **Where** are components located?
- **Who** are the users?
- **How** to use the platform?
- **How** to develop features?

### 4. [MCP_GUIDE.md](./MCP_GUIDE.md)
Complete MCP (Model Context Protocol) guide:
- What is MCP?
- MCP architecture
- MCP server implementation
- MCP client usage
- Tool definitions
- Integration with Claude Desktop

### 5. [AGENTS_GUIDE.md](./AGENTS_GUIDE.md)
AI Agent orchestration documentation:
- Agent types and responsibilities
- Agent workflows
- Task classification
- Quality gates
- Context packet structure
- Handoff protocols

### 6. [GENERATE_PDF.md](./GENERATE_PDF.md)
Instructions for generating PDF documentation:
- Multiple methods for PDF generation
- Recommended tools
- Step-by-step guides
- Formatting tips

## 🚀 Quick Links

### For Developers
- [System Architecture](./ARCHITECTURE.md#system-architecture)
- [Development Setup](./HOW_TO_USE.md#development-setup)
- [API Endpoints](./ARCHITECTURE.md#api-endpoints)
- [Component Structure](./ARCHITECTURE.md#frontend-architecture)

### For Users
- [Getting Started](./HOW_TO_USE.md#getting-started)
- [Publishing Routes](./HOW_TO_USE.md#publishing-routes)
- [Booking Seats](./HOW_TO_USE.md#booking-seats)
- [Using Chat](./HOW_TO_USE.md#comments-and-chat)

### For AI/MCP Integration
- [MCP Overview](./MCP_GUIDE.md#what-is-mcp)
- [MCP Server Setup](./MCP_GUIDE.md#mcp-server-setup)
- [Tool Definitions](./MCP_GUIDE.md#tool-definitions)
- [Claude Desktop Integration](./MCP_GUIDE.md#claude-desktop-integration)

### For DevOps/Orchestration
- [Agent Types](./AGENTS_GUIDE.md#agent-types)
- [Workflow Patterns](./AGENTS_GUIDE.md#workflow-patterns)
- [Quality Gates](./AGENTS_GUIDE.md#quality-gates)
- [Task Classification](./AGENTS_GUIDE.md#task-classification)

## 📊 Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Carpooling Platform                        │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐             │
│  │  Frontend │  │  Backend  │  │    MCP    │             │
│  │  (React)  │◄─┤ (Node.js) │◄─┤  Server   │             │
│  │           │  │ +Express  │  │  (GitHub) │             │
│  └───────────┘  └─────┬─────┘  └───────────┘             │
│                       │                                     │
│                       ▼                                     │
│                  ┌─────────┐                               │
│                  │PostgreSQL│                              │
│                  │ Database │                              │
│                  └─────────┘                               │
│                                                             │
│  Features:                                                  │
│  • User Authentication (JWT)                               │
│  • Route Publishing & Discovery                            │
│  • Seat Booking (Max 4 seats/vehicle)                      │
│  • Real-time Comments/Chat                                 │
│  • Travel History Tracking                                 │
│  • MCP Agent Integration                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Concepts

### Platform Purpose
A vehicle pooling platform where users can:
- **Publish** route plans with departure/arrival details
- **Book** seats on existing routes
- **Communicate** via comments/chat
- **Track** travel history and reputation

### Key Constraints
- ⚠️ **Maximum 4 seats per vehicle**
- 🚫 **No self-booking** (publisher cannot book their own route)
- 💬 **Comments required** for coordination
- 📊 **Travel history** tracked for reputation

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **JWT** - Authentication

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Octokit** - GitHub API client

### MCP Layer
- **@modelcontextprotocol/sdk** - MCP protocol
- **Zod** - Schema validation
- **JSON-RPC 2.0** - Communication protocol

## 📈 Project Status

### ✅ Completed
- User authentication (register/login)
- Route CRUD operations
- Seat booking system
- Comments/chat system
- Database schema and migrations
- MCP server implementation
- GitHub integration tools
- AI agent orchestration framework

### 🚧 In Progress
- Travel history UI
- User reputation system
- Real-time notifications
- Advanced search and filters

### 📋 Planned
- Mobile responsive design
- Payment integration
- Rating system
- Route optimization
- Real-time location tracking

## 📖 Documentation Standards

All documentation follows these principles:
- **Clear structure** with table of contents
- **Visual diagrams** using Mermaid
- **Code examples** with explanations
- **Step-by-step guides** for common tasks
- **Cross-references** between documents
- **Version information** and timestamps

## 🤝 Contributing

When updating documentation:
1. Keep diagrams up to date
2. Add examples for new features
3. Update all relevant cross-references
4. Test all code snippets
5. Regenerate PDF if needed

## 📞 Support

For questions or issues:
- Review the relevant documentation file
- Check workflow diagrams for understanding
- Refer to HOW_TO_USE.md for common tasks
- Review ARCHITECTURE.md for technical details

---

**Last Updated:** 2026-06-11  
**Version:** 1.0.0  
**Status:** Production Ready
