from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from .handler import _list_of_business_entities, _create_business_entity, _update_business_entity, _soft_delete_business_entity, _get_business_entity, _upload_logo
from ....utils import get_db, UploadHelper
from ....auth.handler import get_current_user
from ....exceptions import unique_validations_fail_exception, not_found_exception
from .schemas import BusinessEntitySchema, BusinessEntityCreateSchema, BusinessEntityUpdateSchema, CreateForm
from typing import Annotated, Union, Optional


router = APIRouter()

@router.get('/')
def list_of_business_entities(
    db: Session = Depends(get_db), 
    page: int = 1, 
    page_size: int = 10,
    user = Depends(get_current_user)
):
    return _list_of_business_entities(db, page, page_size)

@router.get('/{id}', response_model=BusinessEntitySchema)
def get_business_entity(
    id: int, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    entity = _get_business_entity(db, id)

    if isinstance(entity, int) and entity == 0:
        detail = {"error": True, "message": "Business Entity not found."}
        raise not_found_exception(detail)
    
    return entity

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=BusinessEntitySchema)
def create_business_entity(
    be_input: BusinessEntityCreateSchema, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = _create_business_entity(db, be_input, user.user_master_id)

    # Result returend integer since a record with given business_entity_name already exists
    if isinstance(result, int) and result == 1:
        detail = {"error": True, "message": "Business Entity with given name already exists."}
        raise unique_validations_fail_exception(detail)
    
    return result

@router.patch('/{id}', response_model=BusinessEntitySchema)
def update_business_entity(
    id: int, 
    be_input: BusinessEntityUpdateSchema, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = _update_business_entity(db, id, be_input, user.user_master_id)
    
    # If not found
    if isinstance(result, int) and result == 0:
        detail = {"error": True, "message": "Business Entity not found."}
        raise not_found_exception(detail)
    
    # Unique business_entity_name
    if isinstance(result, int) and result == 1:
        detail = {"error": True, "message": "Business Entity with given name already exists."}
        raise unique_validations_fail_exception(detail)
    
    return result

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_business_entity(
    id: int, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = _soft_delete_business_entity(db, id, user.user_master_id)

    if result == 0:
        detail = {"error": True, "message": "Business Entity not found."}
        raise not_found_exception(detail)

# @router.post('/{id}/logo')    
# async def upload_logo(
#     id: int, 
#     logo: UploadFile,
#     db: Session = Depends(get_db)
# ):
    # return os.path.abspath(os.path.join(os.getcwd(), os.pardir))

    # return contents.decode()
    # try:
        # result = await _upload_logo(db, id, logo, 1)
        
        # if result == 0:
        #     detail = {"error": True, "message": "Business entity not found"}
        #     raise not_found_exception()

        # if result == 1:
        #     return {"error": False, "message": "Logo uploaded successfully"}
    # except Exception:
    #     print(Exception)
    #     return {"error": True, "message": "Logo upload failed, please try again later"}
