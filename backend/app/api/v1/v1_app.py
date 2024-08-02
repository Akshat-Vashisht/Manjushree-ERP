from fastapi import FastAPI
from .container_category_master.router import router as container_category_master_router
from .container_master.router import router as container_master_router
from .container_movement_master.router import router as container_movement_master_router
from .dashboard.router import router as dashboard_router
from .pick_list_details.router import router as pick_list_details_router
from .reports.router import router as reports_router
from .scan_location_master.router import router as scan_location_master_router
from .user_master.router import router as user_master_router
from ...auth.router import router as auth_router

v1_app = FastAPI(
    title='Manjushree API docs',
    description='This contains all the APIs in v1',
    version='1.0',
    docs_url='/'
)

v1_app.include_router(container_category_master_router, tags=[
                      'Container Category Master'], prefix='/container-categories')
v1_app.include_router(container_master_router, tags=[
                      'Container Master'], prefix='/containers')
v1_app.include_router(container_movement_master_router, tags=[
                      'container-movement'], prefix='/container-movement')
v1_app.include_router(dashboard_router, tags=[
                      'dashboard'], prefix='/dashboard')
v1_app.include_router(pick_list_details_router, tags=[
                      'pick_list_details'], prefix='/pick-list-details')
v1_app.include_router(reports_router, tags=['reports'], prefix='/reports')
v1_app.include_router(scan_location_master_router, tags=[
                      'scan_location'], prefix='/scan-locations')
v1_app.include_router(user_master_router, tags=[
                      'user_master'], prefix='/users')
v1_app.include_router(auth_router, tags=['auth'], prefix='/auth')
