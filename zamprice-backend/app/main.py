from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, products, basket, alerts, admin

app = FastAPI(title="ZamPrice API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_list,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(basket.router)
app.include_router(alerts.router)
app.include_router(admin.router)

@app.get("/health")
def health():
    return {"status": "ok"}
