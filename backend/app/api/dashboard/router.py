from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from ...auth.handler import get_current_user
from ...utils import get_db
from .handler import get_dashboard_4, get_dashboard_3, get_dashboard_2, get_dashboard_1

router = APIRouter(
    prefix='/dashboard',
    tags=['dashboard']
)
# router.dependencies = [Depends(get_current_user)]


@router.get('/dashboard-4')
async def dashboard4(db: Session = Depends(get_db)):
    try:
        empty_containers_location_wise = jsonable_encoder(
            get_dashboard_4(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=empty_containers_location_wise)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/dashboard-3')
async def dashboard3(db: Session = Depends(get_db)):
    try:
        empty_container_category_wise = jsonable_encoder(
            get_dashboard_3(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=empty_container_category_wise)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/dashboard-2')
async def dashboard2(db: Session = Depends(get_db)):
    try:
        manjushree_containers_location_wise = jsonable_encoder(
            get_dashboard_2(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=manjushree_containers_location_wise)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/dashboard-1')
async def dashboard1(db: Session = Depends(get_db)):
    try:
        location_wise_containers = jsonable_encoder(
            get_dashboard_1(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=location_wise_containers)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
