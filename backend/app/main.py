from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from .api.container_master.router import router as container_master_router

app = FastAPI(debug=True)
app.include_router(container_master_router)


@app.get('/health-check')
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'working'})
