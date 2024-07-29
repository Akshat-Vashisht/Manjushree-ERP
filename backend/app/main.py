# import os
# import sys

# current_dir = os.path.dirname(os.path.abspath(__file__))
# src_path = os.path.abspath(os.path.join(current_dir, '..'))

# if src_path not in sys.path:
#     sys.path.append(src_path)

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
from .api.user_master.router import router as user_master_router
from .api.business_entity_master.router import router as business_entity_router

from .database import engine
from .models import Base

Base.metadata.create_all(bind=engine)

from .api.reports.router import router as reports_router

app = FastAPI(debug=True, docs_url='/')
app.include_router(container_master_router)
app.include_router(container_movement_router)
app.include_router(scan_location_master_router)
app.include_router(sku_master_router)
app.include_router(container_category_router)
app.include_router(pick_list_master_router)
app.include_router(pick_list_details_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(user_master_router)
app.include_router(business_entity_router)
app.include_router(reports_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'https://redi-vs.vercel.app',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health-check')
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'working'})