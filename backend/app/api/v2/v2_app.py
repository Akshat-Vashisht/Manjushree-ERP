from fastapi import APIRouter, FastAPI
from .business_entity_master.router import router as business_entity_master_router
from .sku_master.router import router as sku_master_v2_router
from .pick_list_master.router import router as pick_list_master_v2_router
from ...auth.router import router as auth_router
from .pick_list_details.router import router as pick_list_details_router
from .pick_list_v2.router import router as pick_list_v2_router

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
v2_app.include_router(business_entity_master_router, tags=[
                      'BUSINESS ENTITY APIs'], prefix='/business-entities')
v2_app.include_router(pick_list_details_router, tags=[
                      'PICK LIST DETAILS API'], prefix='/pick-list-details')
v2_app.include_router(pick_list_v2_router, tags=[
                      'PICK LIST V2 API'], prefix='/pick-list-v2')

v2_auth_router = APIRouter(
    prefix='/auth',
    tags=['AUTH']
)
v2_auth_router.add_api_route(
    '/login', auth_router.routes[0].endpoint, methods=['POST'])
v2_auth_router.add_api_route(
    '/logout', auth_router.routes[2].endpoint, methods=['POST'])
v2_app.include_router(v2_auth_router)
