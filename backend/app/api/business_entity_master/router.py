from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .handler import _list_of_business_entities, _create_business_entity, _update_business_entity, _soft_delete_business_entity, _get_business_entity
from ...utils import get_db
from ...exceptions import unique_validations_fail_exception, not_found_exception
from .schemas import BusinessEntitySchema, BusinessEntityCreateSchema, BusinessEntityUpdateSchema

router = APIRouter(
    prefix='/business-entities',
    tags=['business_entities']
)

@router.get('/')
def list_of_business_entities(db: Session = Depends(get_db), page: int = 1, page_size: int = 10):
    return _list_of_business_entities(db, page, page_size)

@router.get('/{id}', response_model=BusinessEntitySchema)
def get_business_entity(id: int, db: Session = Depends(get_db)):
    entity = _get_business_entity(db, id)

    if isinstance(entity, int) and entity == 0:
        detail = {"error": True, "message": "Business Entity not found."}
        raise not_found_exception(detail)
    
    return entity

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=BusinessEntitySchema)
def create_business_entity(be_input: BusinessEntityCreateSchema, db: Session = Depends(get_db)):
    # TODO: Remove hardcoded last_updated_by
    result = _create_business_entity(db, be_input, 1)

    # Result returend integer since a record with given business_entity_name already exists
    if isinstance(result, int) and result == 1:
        detail = {"error": True, "message": "Business Entity with given name already exists."}
        raise unique_validations_fail_exception(detail)
    
    return result

@router.patch('/{id}', response_model=BusinessEntitySchema)
def update_business_entity(id: int, be_input: BusinessEntityUpdateSchema, db: Session = Depends(get_db)):
    # TODO: Remove hardcoded last_updated_by
    result = _update_business_entity(db, id, be_input, 1)
    
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
def delete_business_entity(id: int, db: Session = Depends(get_db)):
    result = _soft_delete_business_entity(db, id, 1)

    if result == 0:
        detail = {"error": True, "message": "Business Entity not found."}
        raise not_found_exception(detail)