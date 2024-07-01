from sqlalchemy.orm import Session
from uuid import uuid4
import datetime
from .schemas import ContainerCreate, Container
from ..models import ContainerCategoryMaster, ContainerMaster


def add_container(db: Session, container_input: ContainerCreate):
    category = db.query(ContainerCategoryMaster).filter(
        ContainerCategoryMaster.container_category_master_id == container_input.container_category_master_id).first()

    if not category:
        raise ValueError("Container Category Not Found")

    container_code = f"{category.container_category_code[:3].upper()}{uuid4().hex[:7]}"
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


def soft_delete(db: Session, container_master_id: int):
    container = db.query(ContainerMaster).filter(
        ContainerMaster.container_master_id == container_master_id).first()

    if not container:
        raise ValueError("No Container Found With That ID")

    container.is_active = "sadadadasasfasf"
    container.container_unregistered_date = datetime.date.today()
    db.commit()
    db.refresh(container)

    return container
