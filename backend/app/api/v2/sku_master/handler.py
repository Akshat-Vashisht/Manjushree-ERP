from sqlalchemy import func
from sqlalchemy.orm import Session
from ....models import SKUMaster
from ....utils import now, fetch_data
from .schemas import SKUCreateSchema, SKUSchema
import datetime


def fetch_scan_locations(db: Session, page: int, page_size: int):
    offset = page_size * (page - 1)

    _query = db.query(SKUMaster)

    record_count = _query.count()

    pagination = {
        "total_pages": record_count / page_size,
        "current_page": page,
        "total_records": record_count,
        "records": [SKUSchema.model_validate(each) for each in _query.offset(offset).limit(page_size)]
    }

    return pagination


def add_sku(db: Session, sku_input: list[SKUCreateSchema], last_updated_by: int):

    new_skus = []
    for sku in sku_input:
        exists = (
            db.query(func.count())
            .select_from(SKUMaster)
            .where(SKUMaster.sku_code == sku.sku_code)
            .scalar()
        )

        if exists > 0:
            continue  # Skip this entry if it already exists

        data = sku.model_dump()
        data.update({
            'is_active': True,
            'last_updated_dt': now(return_string=True),
            'last_updated_by': last_updated_by
        })

        new_sku = SKUMaster(**data)
        new_skus.append(new_sku)

    if new_skus:
        db.bulk_save_objects(new_skus)
        db.commit()

    return new_skus


def update_sku(id: int, sku_input: SKUCreateSchema, last_updated_by: int, db: Session):
    sku = fetch_data(db, SKUMaster, 'sku_master_id', id)

    exists = (
        db.query(func.count())
        .select_from(SKUMaster)
        .where(SKUMaster.sku_code == sku_input.sku_code)
        .scalar()
    )

    if exists > 0:
        raise ValueError("SKU with given code already exists")

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
