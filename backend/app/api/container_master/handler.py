from sqlalchemy.orm import Session
import datetime

from ...utils import fetch_data
from .schemas import ContainerCreateSchema, ContainerUpdateSchema, ContainerWithCategorySchema
from ...models import ContainerCategoryMaster, ContainerMaster
from ..container_movement_master.handler import delete_container_movement
TOTAL_CONTAINER_CODE_LENGTH = 10


def add_container(db: Session, container_input: ContainerCreateSchema):
    category = fetch_data(
        db, ContainerCategoryMaster, 'container_category_master_id', container_input.container_category_master_id)

    category_code = category.container_category_code
    count = db.query(ContainerMaster).count()

    serial_no = f'{count + 1}'
    num_zeros = TOTAL_CONTAINER_CODE_LENGTH - \
        len(category_code) - len(serial_no)
    padded_serial_no = '0' * num_zeros + serial_no

    container_code = f'{category_code}{padded_serial_no}'

    category_name = category.container_category

    container = ContainerMaster(
        container_category_master_id=container_input.container_category_master_id,
        container_code=container_code,
        container_registration_dt=datetime.datetime.now(datetime.UTC),
        container_status=container_input.container_status,
        rfid_tag_no=container_input.rfid_tag_no,
        rfid_registration_dt=datetime.datetime.now(datetime.UTC),
        last_updated_dt=datetime.datetime.now(datetime.UTC),
        last_updated_by=container_input.last_updated_by
    )

    db.add(container)
    db.commit()
    db.refresh(container)


def fetch_containers(db: Session):
    containers = db.query(ContainerMaster).all()

    for container in containers:
        container_category = fetch_data(
            db, ContainerCategoryMaster, 'container_category_master_id', container.container_category_master_id)
        container.container_category = container_category.container_category

    return containers


def soft_delete(db: Session, container_master_id: int, last_updated_by: int):
    container = fetch_data(db, ContainerMaster,
                           'container_master_id', container_master_id)

    container.is_active = False
    container.container_unregistered_date = datetime.date.today()
    container.last_updated_dt = datetime.datetime.now(datetime.UTC)
    container.last_updated_by = last_updated_by

    db.commit()
    db.refresh(container)

    delete_container_movement(db, container.container_master_id)


def update_container_data(db: Session, container_input: ContainerUpdateSchema):
    container = fetch_data(
        db, ContainerMaster, 'container_master_id', container_input.container_master_id)

    container.container_status = container_input.container_status
    container.rfid_tag_no = container_input.rfid_tag_no
    container.last_updated_dt = datetime.datetime.now(datetime.UTC)
    container.last_updated_by = container_input.last_updated_by

    db.commit()
    db.refresh(container)

    return container
