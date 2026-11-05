ZamPrice Project/
├── src/                              # React Frontend (Components, Pages, Context)
│   ├── api/
│   │   └── client.ts                 # API client for backend communication
│   ├── components/
│   │   └── NavBar.tsx                # Navigation bar component
│   ├── context/
│   │   └── AuthContext.jsx           # Authentication context provider
│   ├── data/
│   │   └── sampleData.ts             # Mock/sample data for development
│   ├── pages/                        # Application pages/routes
│   │   ├── AdminPage.tsx             # Admin dashboard and management
│   │   ├── AlertsPage.tsx            # Price alerts and notifications
│   │   ├── BasketPage.tsx            # Shopping basket management
│   │   ├── BudgetPage.tsx            # Budget tracking and planning
│   │   ├── ComparePage.tsx           # Product price comparison
│   │   ├── Dashboard.tsx             # Main user dashboard
│   │   ├── DealsPage.tsx             # Special deals and promotions
│   │   ├── LandingPage.tsx           # Public landing page
│   │   ├── LocationPage.tsx          # Store location selection
│   │   ├── LoginPage.tsx             # User authentication
│   │   ├── OptimisePage.tsx          # Basket optimization recommendations
│   │   ├── PriceHistoryPage.tsx      # Historical price charts
│   │   ├── ProfilePage.tsx           # User profile and settings
│   │   ├── SearchPage.tsx            # Product search functionality
│   │   ├── SubstitutionsPage.tsx     # Product substitution suggestions
│   │   └── SupermarketsPage.tsx      # Supermarket listings and info
│   ├── App.tsx                       # Main application component with routing
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Global styles and Tailwind CSS v4 import
│   └── vite-env.d.ts                 # Vite TypeScript declarations
├── zamprice-backend/                 # FastAPI Backend
│   ├── app/                          # Main application logic (API, Models, Services)
│   │   ├── api/                      # API route handlers
│   │   │   ├── admin.py              # Admin endpoints
│   │   │   ├── alerts.py             # Alert management endpoints
│   │   │   ├── auth.py               # Authentication endpoints
│   │   │   ├── basket.py             # Shopping basket endpoints
│   │   │   └── products.py           # Product catalog endpoints
│   │   ├── core/                     # Core configuration and utilities
│   │   │   ├── config.py             # Application settings
│   │   │   ├── deps.py               # Dependency injection providers
│   │   │   └── security.py           # Auth and authorization utilities
│   │   ├── db/                       # Database layer
│   │   │   ├── base.py               # SQLAlchemy base model
│   │   │   └── session.py            # Database session management
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   └── __init__.py           # Model exports
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   │   ├── alert.py              # Alert schemas
│   │   │   ├── auth.py               # Authentication schemas
│   │   │   ├── basket.py             # Basket schemas
│   │   │   ├── catalog.py            # Product catalog schemas
│   │   │   └── comparison.py         # Price comparison schemas
│   │   ├── services/                 # Business logic services
│   │   │   ├── alerts.py             # Alert processing service
│   │   │   ├── basket.py             # Basket management service
│   │   │   ├── comparison.py         # Price comparison service
│   │   │   ├── explanation.py        # Recommendation explanation service
│   │   │   └── units.py              # Unit conversion and normalization
│   │   ├── main.py                   # FastAPI application entry point
│   │   └── __init__.py               # Package initializer
│   ├── api/                          # Legacy API modules (mirrors app/api)
│   ├── core/                         # Legacy core modules (mirrors app/core)
│   ├── db/                           # Legacy database modules (mirrors app/db)
│   ├── models/                       # Legacy models (mirrors app/models)
│   ├── schemas/                      # Legacy schemas (mirrors app/schemas)
│   ├── services/                     # Legacy services (mirrors app/services)
│   ├── bootstrap.py                  # Database initialization script
│   ├── seed.py                       # Database seeding script
│   ├── requirements.txt              # Python dependencies
│   ├── zamprice.db                   # SQLite database file
│   └── .env.example                  # Environment variables template
├── index.html                        # Vite HTML entry point
├── package.json                      # Frontend dependencies and scripts
├── vite.config.ts                    # Vite configuration (React + Tailwind)
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation