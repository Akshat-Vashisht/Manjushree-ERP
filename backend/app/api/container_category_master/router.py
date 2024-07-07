from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import ContainerCategorySchema, ContainerCategoryWithId
from ...utils import get_db
from .handler import fetch_container_category, fetch_container_id_and_category

router = APIRouter(
    prefix='/container-categories',
    tags=['container-categories']
)


@router.get('/', response_model=list[ContainerCategorySchema])
async def get_containers(db: Session = Depends(get_db)):
    try:
        container_categories = jsonable_encoder(fetch_container_category(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=container_categories)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/category-id', response_model=list[ContainerCategoryWithId])
async def get_container_id_and_category(db: Session = Depends(get_db)):
    try:
        container_category_with_id = fetch_container_id_and_category(db)
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': container_category_with_id})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
