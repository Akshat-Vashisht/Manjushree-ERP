from sqlalchemy.orm import Session
from ...models import BusinessEntityMaster
from ...utils import fetch_data, now
from .schemas import BusinessEntityCreateSchema


def fetch_business_entities(db: Session):
    entities = db.query(BusinessEntityMaster).all()
    return entities

def add_business_entity(db: Session, be_input: BusinessEntityCreateSchema, last_updated_by: int):
    data = be_input.model_dump()
    data.update({
        'last_updated_dt': now(return_string=True),
        'last_updated_by': last_updated_by
    })

    entity = BusinessEntityMaster(**data)

    db.add(entity)
    db.commit()

    return entity
