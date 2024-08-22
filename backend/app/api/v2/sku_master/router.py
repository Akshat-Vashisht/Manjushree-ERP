from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import SKUSchema, SKUCreateSchema
from ....utils import get_db
from .handler import fetch_scan_locations, add_sku, update_sku, soft_delete_sku
from ....auth.handler import get_current_user
from ....exceptions import DataNotFoundError

router = APIRouter()
router.dependencies = [Depends(get_current_user)]


@ router.get('/', response_model=list[SKUSchema])
async def get_skus(
    token: str,
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 10,
    user=Depends(get_current_user)
):
    try:
        scan_locations = jsonable_encoder(
            fetch_scan_locations(db, page, page_size))
        return JSONResponse(status_code=status.HTTP_200_OK, content=scan_locations)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@ router.post('/', status_code=status.HTTP_201_CREATED, response_model=list[SKUSchema])
async def create_sku(
    token: str,
    sku_input: list[SKUCreateSchema],
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # TODO: Change hardcoded created_by value to retrieve value from current user
    try:
        result = jsonable_encoder(add_sku(
            db, sku_input, user.user_master_id))
        if not result:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={'detail': 'No unique sku code found.'})
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=result)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@ router.patch('/{id}', response_model=SKUSchema)
async def update_sku_details(
    token: str,
    id: int,
    sku_input: SKUCreateSchema,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # TODO: Change hardcoded created_by value to retrieve value from current user
    try:
        result = jsonable_encoder(update_sku(
            id, sku_input, user.user_master_id, db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@ router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_sku(
    token: str,
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # TODO: Change hardcoded created_by value to retrieve value from current user
    try:
        soft_delete_sku(id, user.user_master_id, db)
    except DataNotFoundError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={'detail': str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
