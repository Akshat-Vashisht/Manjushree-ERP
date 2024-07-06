from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import ContainerCategorySchema
from ...utils import get_db
from .handler import fetch_container_category

router = APIRouter(
    prefix='/container-categories',
    tags=['container-categories']
)


@router.get('/', response_model=list[ContainerCategorySchema])
async def get_containers(db: Session = Depends(get_db)):
    try:
        scan_locations = jsonable_encoder(fetch_container_category(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': scan_locations})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
