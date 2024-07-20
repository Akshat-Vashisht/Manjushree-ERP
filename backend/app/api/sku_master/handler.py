from sqlalchemy.orm import Session
from ...models import SKUMaster
from ...utils import now, fetch_data
from .schemas import SKUCreateSchema
import datetime

def fetch_scan_locations(db: Session):
    sku_list = db.query(SKUMaster).all()
    return sku_list

def add_sku(db: Session, sku_input: SKUCreateSchema, last_updated_by: int):
    data = sku_input.model_dump()

    data.update({
        "is_active": True,
        "last_updated_dt": now(return_string=True),
        "last_updated_by": last_updated_by
    })
    sku = SKUMaster(**data)

    db.add(sku)
    db.commit()

    return sku

def update_sku(id: int, sku_input: SKUCreateSchema, last_updated_by: int, db: Session):
    sku = fetch_data(db, SKUMaster, 'sku_master_id', id)

    sku.sku_code = sku_input.sku_code
    sku.sku_name = sku_input.sku_name
    sku.last_updated_dt = now(return_string=True)
    sku.last_updated_by = last_updated_by

    db.add(sku)
    db.commit()
    db.refresh(sku)

    return sku

def soft_delete_sku(id: int, last_updated_by: int, db: Session):
    sku = fetch_data(db, SKUMaster, 'sku_master_id', id)

    sku.is_active = False
    sku.last_updated_dt = now(return_string=True)
    sku.last_updated_by = last_updated_by

    db.add(sku)
    db.commit()
    