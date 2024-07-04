from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .api.container_master.router import router as container_master_router

app = FastAPI(debug=True)
app.include_router(container_master_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/health-check')
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'working'})
