from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import PickListResponseSchema
from ...utils import get_db
from .handler import fetch_pick_list_details
from ...auth.handler import get_current_user

router = APIRouter(
    prefix='/pick-list-details',
    tags=['pick_list_details']
)
router.dependencies = [Depends(get_current_user)]


@router.get('/{pick_list_details_id}', response_model=list[PickListResponseSchema])
async def get_containers(pick_list_details_id: int, db: Session = Depends(get_db)):
    try:
        pick_list_details = jsonable_encoder(
            fetch_pick_list_details(db, pick_list_details_id))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': pick_list_details})
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
