from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from .api.container_master.router import router as container_master_router
from .api.container_movement_master.router import router as container_movement_router
from .api.scan_location_master.router import router as scan_location_master_router
from .api.sku_master.router import router as sku_master_router
from .api.container_category_master.router import router as container_category_router
from .api.pick_list_master.router import router as pick_list_master_router
from .api.pick_list_details.router import router as pick_list_details_router
from .auth.router import router as auth_router
from .api.dashboard.router import router as dashboard_router

app = FastAPI(debug=True)
app.include_router(container_master_router)
app.include_router(container_movement_router)
app.include_router(scan_location_master_router)
app.include_router(sku_master_router)
app.include_router(container_category_router)
app.include_router(pick_list_master_router)
app.include_router(pick_list_details_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://127.0.0.1:3000',
        'http://localhost:3000'
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health-check')
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'working'})
