from sqlalchemy.orm import Session
import datetime
from .schemas import ContainerCreate
from ..models import ContainerCategoryMaster, ContainerMaster

CATEGORY_LENGTH = 3
TOTAL_CONTAINER_CODE_LENGTH = 10


def add_container(db: Session, container_input: ContainerCreate):
    category = db.query(ContainerCategoryMaster).filter(
        ContainerCategoryMaster.container_category_master_id == container_input.container_category_master_id).first()

    if not category:
        raise ValueError("Container Category Not Found")

    category_name = category.container_category_code[:3]
    count = db.query(ContainerMaster).count()

    serial_no = f"{count + 1}"
    num_zeros = TOTAL_CONTAINER_CODE_LENGTH - CATEGORY_LENGTH - len(serial_no)
    padded_serial_no = '0' * num_zeros + serial_no

    container_code = f"{category_name}{padded_serial_no}"

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

    return container


def fetch_containers(db: Session):
    containers = db.query(ContainerMaster).all()
    return containers


def soft_delete(db: Session, container_master_id: int, last_updated_by: int):
    container = db.query(ContainerMaster).filter(
        ContainerMaster.container_master_id == container_master_id).first()

    if not container:
        raise ValueError("No Container Found With That ID")

    container.is_active = False
    container.container_unregistered_date = datetime.date.today()
    container.last_updated_dt = datetime.datetime.now(datetime.UTC)
    container.last_updated_by = last_updated_by
    db.commit()
    db.refresh(container)

    return container
