from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from .api.v1.v1_app import v1_app
from .api.v2.v2_app import v2_app
from .database import engine
from .models import Base

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.mount("/v1", v1_app)
app.mount("/v2", v2_app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'https://redi-vs.vercel.app',
        'https://test-redi-vs.vercel.app'
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health-check')
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'working'})
