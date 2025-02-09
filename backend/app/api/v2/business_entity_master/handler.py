from sqlalchemy import func
from sqlalchemy.orm import Session
from ....models import BusinessEntityMaster
from ....utils import now, paginate
from .schemas import BusinessEntityCreateSchema, BusinessEntityUpdateSchema, BusinessEntitySchema, CreateForm
from fastapi import UploadFile, File
from typing import Annotated, Optional, Union
import os
import shutil


def _list_of_business_entities(db: Session, page: int, page_size: int):
    # return paginate(db.query(BusinessEntityMaster), BusinessEntitySchema, page, page_size)
    offset = page_size * (page - 1)

    _query = db.query(BusinessEntityMaster)

    record_count = _query.count()

    pagination = {
        "total_pages": record_count / page_size,
        "current_page": page,
        "total_records": record_count,
        "records": [BusinessEntitySchema.model_validate(each) for each in _query.offset(offset).limit(page_size)]
    }

    return pagination


def _get_business_entity(db: Session, id: int):
    entity = db.get(BusinessEntityMaster, id)

    if not entity:
        return 0

    return entity


def _create_business_entity(db: Session, be_input: list[BusinessEntityCreateSchema], last_updated_by: int):

    new_entities = []
    for be in be_input:
        # Check for unique business_entity_code
        exists = (
            db.query(func.count())
            .select_from(BusinessEntityMaster)
            .where(BusinessEntityMaster.business_entity_code == be.business_entity_code)
            .scalar()
        )

        if exists > 0:
            continue  # Skip this entry if it already exists

        # Prepare the data
        data = be.model_dump()
        data.update({
            'is_active': True,
            'last_updated_dt': now(return_string=True),
            'last_updated_by': last_updated_by
        })

        entity = BusinessEntityMaster(**data)
        new_entities.append(entity)

    if new_entities:
        db.bulk_save_objects(new_entities)
        db.commit()

    return new_entities


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

    # Check for unique business_entity_code
    exists = (
        db.query(func.count())
        .select_from(BusinessEntityMaster)
        .where(BusinessEntityMaster.business_entity_code == be_input.business_entity_code)
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

# Abandoned temporarily till file issue is resolved


async def _upload_logo(
    db: Session,
    id: int,
    logo: UploadFile,
    last_updated_by: int,
):
    entity = _get_business_entity(db, id)

    if isinstance(entity, int) and entity == 0:
        return 0

    location = os.path.join('uploads', logo.filename)
    # content = await logo.read()

    with open(location, 'wb') as f:
        f.write(logo.file.read())

    # await logo.write(content)

    # entity.logo = content
    # entity.last_updated_by = last_updated_by
    # entity.last_updated_dt = now(return_string=True)

    # db.add(entity)
    # db.commit()

    return 1
