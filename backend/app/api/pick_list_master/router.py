from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import PickListSchema
from ...utils import get_db
from .handler import fetch_pick_list

router = APIRouter(
    prefix='/pick-list',
    tags=['pick_list']
)


@router.get('/{code}', response_model=list[PickListSchema])
async def get_containers(code: int, db: Session = Depends(get_db)):
    try:
        pick_list = jsonable_encoder(fetch_pick_list(db, code))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': pick_list})
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
