from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from ...utils import get_db
from .handler import upsert_container_movement
from .schemas import ContainerMovementCreateSchema, ContainerMovementSchema
from ...exceptions import DataNotFoundError


router = APIRouter(
    prefix='/container-movement',
    tags=['container-movement']
)


@router.post('/', response_model=ContainerMovementSchema)
async def create_container_movement(container_movement: ContainerMovementCreateSchema, db: Session = Depends(get_db)):
    try:
        upserted_container = jsonable_encoder(
            upsert_container_movement(db, container_movement))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': upserted_container})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
