from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .handler import fetch_business_entities, add_business_entity
from ...utils import get_db
from .schemas import BusinessEntitySchema, BusinessEntityCreateSchema

router = APIRouter(
    prefix='/business-entities',
    tags=['business_entities']
)

@router.get('/')
def list_of_business_entities(db: Session = Depends(get_db)):
    return fetch_business_entities(db)

@router.post('/')
def create_business_entity(be_input: BusinessEntityCreateSchema, db: Session = Depends(get_db)):
    # TODO: Remove hardcoded last_updated_by
    return add_business_entity(db, be_input, 1)

@router.patch('/{id}')
def update_business_entity(id: int, db: Session = Depends(get_db)):
    pass

@router.delete('/{id}')
def delete_business_entity(id: int, db: Session = Depends(get_db)):
    pass