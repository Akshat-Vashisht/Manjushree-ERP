from fastapi import APIRouter, FastAPI
from .sku_master.router import router as sku_master_v2_router
from .pick_list_master.router import router as pick_list_master_v2_router
from ...auth.router import router as auth_router

v2_app = FastAPI(
    title='Manjushree ERP API',
    description='This contains all the APIs for Manjushree ERP',
    version='1.0',
    docs_url='/'
)

v2_app.include_router(sku_master_v2_router,
                      prefix='/sku', tags=['SKU APIs'])
v2_app.include_router(pick_list_master_v2_router,
                      prefix='/pick-list', tags=['PICK LIST APIs'])

v2_auth_router = APIRouter(
    prefix='/auth',
    tags=['AUTH']
)
v2_auth_router.add_api_route(
    '/login', auth_router.routes[1].endpoint, methods=['POST'])
v2_auth_router.add_api_route(
    '/logout', auth_router.routes[3].endpoint, methods=['POST'])
v2_app.include_router(v2_auth_router)
