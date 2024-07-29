from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from ...utils import get_db
from .handler import upsert_container_movement, get_all_values, get_history
from .schemas import ContainerMovementCreateSchema, ContainerMovementSchema
from ...exceptions import DataNotFoundError
from ...auth.handler import get_current_user

router = APIRouter(
    prefix='/container-movement',
    tags=['container-movement']
)
router.dependencies = [Depends(get_current_user)]


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


@router.get('/', response_model=ContainerMovementSchema)
async def get_container_movement_values(db: Session = Depends(get_db)):
    try:
        values = jsonable_encoder(get_all_values(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': values})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/history', response_model=ContainerMovementSchema)
async def get_container_movement_history(rfid_tag_no: str | None = None, container_code: str | None = None, db: Session = Depends(get_db)):
    try:
        if not rfid_tag_no and not container_code:
            raise Exception(
                'Please provide either rfid_tag_no or container_code')
        if rfid_tag_no:
            history = jsonable_encoder(
                get_history(db, rfid_tag_no=rfid_tag_no))
        else:
            history = jsonable_encoder(
                get_history(db, container_code=container_code))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': history})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
