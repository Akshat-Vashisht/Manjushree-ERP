from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import SKUSchema, SKUCreateSchema
from ...utils import get_db
from .handler import fetch_scan_locations, add_sku, update_sku, soft_delete_sku
from ...auth.handler import get_current_user

router = APIRouter(
    prefix='/sku',
    tags=['sku_master']
)
router.dependencies = [Depends(get_current_user)]


@router.get('/', response_model=list[SKUSchema])
async def get_containers(db: Session = Depends(get_db)):
    try:
        scan_locations = jsonable_encoder(fetch_scan_locations(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': scan_locations})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})

@router.post('/', response_model=SKUSchema)
async def create_sku(sku_input: SKUCreateSchema, db: Session = Depends(get_db)):
    
    # TODO: Change hardcoded created_by value to retrieve value from current user
    return add_sku(db, sku_input, 1)

@router.patch('/{id}', response_model=SKUSchema)
async def update_sku_details(id: int, sku_input: SKUCreateSchema, db: Session = Depends(get_db)):
    
    # TODO: Change hardcoded created_by value to retrieve value from current user
    return update_sku(id, sku_input, 1, db)

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_sku(id: int, db: Session = Depends(get_db)):
    
    # TODO: Change hardcoded created_by value to retrieve value from current user
    soft_delete_sku(id, 1, db)


