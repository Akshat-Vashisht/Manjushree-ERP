from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from ....exceptions import DataNotFoundError
from .schemas import PickListResponseSchema, PickListCreateSchema, PickListDetailsSchema
from ....utils import get_db
from .handler import fetch_pick_list_details, fetch_all_pick_list_details, create_pick_list_details, update_pick_list_details, delete_pick_list_details
from ....auth.handler import get_current_user

router = APIRouter()
router.dependencies = [Depends(get_current_user)]


@router.get('/{pick_list_details_id}', response_model=list[PickListResponseSchema])
async def get_pick_list_details_by_id(pick_list_details_id: int, db: Session = Depends(get_db)):
    try:
        pick_list_details = jsonable_encoder(
            fetch_pick_list_details(db, pick_list_details_id))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': pick_list_details})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/', response_model=list[PickListResponseSchema])
async def get_all_pick_list_details(db: Session = Depends(get_db)):
    try:
        pick_list_details = jsonable_encoder(fetch_all_pick_list_details(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': pick_list_details})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.post('/', response_model=PickListDetailsSchema)
async def add_pick_list_details(pick_list_details: list[PickListCreateSchema], allow_partial_inserts: bool, db: Session = Depends(get_db)):
    try:
        pick_list_detail = jsonable_encoder(
            create_pick_list_details(db, pick_list_details, allow_partial_inserts))
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={'detail': pick_list_detail})
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.patch('/{pick_list_id}/')
async def update_pick_list(pick_list_id: int, quantity: int, response: Response, db: Session = Depends(get_db)):
    try:
        update_pick_list_details(db, pick_list_id, quantity)
        response.status_code = status.HTTP_204_NO_CONTENT
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.delete('/{pick_list_id}')
async def delete_pick_list(pick_list_id: int, response: Response, db: Session = Depends(get_db)):
    try:
        delete_pick_list_details(db, pick_list_id)
        response.status_code = status.HTTP_204_NO_CONTENT
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
