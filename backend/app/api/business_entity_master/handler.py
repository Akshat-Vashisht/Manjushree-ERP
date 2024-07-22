from sqlalchemy import func
from sqlalchemy.orm import Session
from ...models import BusinessEntityMaster
from ...utils import now
from .schemas import BusinessEntityCreateSchema, BusinessEntityUpdateSchema


def _list_of_business_entities(db: Session):
    entities = db.query(BusinessEntityMaster).all()
    return entities

def _create_business_entity(db: Session, be_input: BusinessEntityCreateSchema, last_updated_by: int):
    # Check for unique business_entity_name
    exists = (
        db.query(func.count())
            .select_from(BusinessEntityMaster)
            .where(BusinessEntityMaster.business_entity_name == be_input.business_entity_name)
            .scalar()
    )

    if exists > 0:
        return 1
    
    data = be_input.model_dump()

    data.update({
        'last_updated_dt': now(return_string=True),
        'last_updated_by': last_updated_by
    })

    entity = BusinessEntityMaster(**data)

    db.add(entity)
    db.commit()

    db.refresh(entity)

    return entity

def _update_business_entity(
    db: Session,
    id: int,
    be_input: BusinessEntityUpdateSchema,
    last_updated_by: int
):
    # Check for existance
    entity = db.get(BusinessEntityMaster, id)

    if not entity:
        return 0

    # Check for unique business_entity_name
    exists = (
        db.query(func.count())
            .select_from(BusinessEntityMaster)
            .where(BusinessEntityMaster.business_entity_name == be_input.business_entity_name)
            .where(BusinessEntityMaster.business_entity_master_id != id)
            .scalar()
    )

    if exists > 0:
        return 1
    
    data = be_input.model_dump()
    data.update({
        "last_updated_dt": now(return_string=True),
        "last_updated_by": last_updated_by
    })

    (
        db.query(BusinessEntityMaster)
            .filter(BusinessEntityMaster.business_entity_master_id == id)
            .update(data, synchronize_session=False) 
    )

    db.commit()

    entity = db.get(BusinessEntityMaster, id)

    return entity
        
def _soft_delete_business_entity(
    db: Session,
    id: int,
    last_updated_by: int,
):
    entity = db.get(BusinessEntityMaster, id)

    if not entity:
        return 0
    
    entity.is_active = False
    entity.last_updated_by = last_updated_by
    entity.last_updated_dt = now(return_string=True)

    db.add(entity)
    db.commit()

    return 1