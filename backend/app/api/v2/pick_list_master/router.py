from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from ....exceptions import DataNotFoundError
from .schemas import PickListCreateSchema, PickListSchema
from ....utils import get_db
from .handler import add_pick_list, delete_pick_list_data, fetch_pick_list, update_pick_list_status
from ....auth.handler import get_current_user

router = APIRouter()
router.dependencies = [Depends(get_current_user)]


@router.get('/{code}', response_model=list[PickListSchema])
async def get_pick_lists(code: int, db: Session = Depends(get_db)):
    try:
        pick_list = jsonable_encoder(fetch_pick_list(db, code))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': pick_list})
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.post('/', response_model=PickListSchema)
async def create_pick_list(pick_list_array: list[PickListCreateSchema], db: Session = Depends(get_db)):
    try:
        pick_list = jsonable_encoder(add_pick_list(db, pick_list_array))
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={'detail': pick_list})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.patch('/{pick_list_id}')
async def update_pick_list(pick_list_id: int, response: Response, db: Session = Depends(get_db)):
    try:
        update_pick_list_status(db, pick_list_id)
        response.status_code = status.HTTP_204_NO_CONTENT
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.delete('/{pick_list_id}')
async def delete_pick_list(pick_list_id: int, response: Response, db: Session = Depends(get_db)):
    try:
        delete_pick_list_data(db, pick_list_id)
        response.status_code = status.HTTP_204_NO_CONTENT
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
