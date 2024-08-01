from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from ....models import BusinessEntityMaster, ContainerMovement
from .schemas import AllContainerDetailsSchema, ContainerDetailsManjushreeSchema, ClientWiseContainerDetailsSchema, VendorWiseContainerDetailsSchema


def get_all_containers_details(db: Session):
    containers = db.query(
        ContainerMovement.business_entity_name,
        ContainerMovement.scanning_dt,
        ContainerMovement.container_category,
        ContainerMovement.container_code,
        ContainerMovement.rfid_tag_no
    ).order_by(
        asc(ContainerMovement.business_entity_name),
        asc(ContainerMovement.scanning_dt),
        asc(ContainerMovement.container_category)
    ).all()

    return [
        AllContainerDetailsSchema(
            business_entity_name=container.business_entity_name,
            datetime=container.scanning_dt,
            container_category=container.container_category,
            container_code=container.container_code,
            rfid_tag_no=container.rfid_tag_no
        )
        for container in containers]


def get_containers_at_manjushree_details(db: Session):
    containers = db.query(
        ContainerMovement.scanning_dt,
        ContainerMovement.location_name,
        ContainerMovement.container_category,
        ContainerMovement.container_code,
        ContainerMovement.rfid_tag_no,
        ContainerMovement.sku_code,
        ContainerMovement.pick_list_code
    ).filter(ContainerMovement.business_entity_name == 'Manjushree'
             ).order_by(desc(ContainerMovement.scanning_dt),
                        asc(ContainerMovement.container_category)).all()

    return [
        ContainerDetailsManjushreeSchema(
            datetime=container.scanning_dt,
            container_location=container.location_name,
            container_category=container.container_category,
            container_code=container.container_code,
            rfid_tag_no=container.rfid_tag_no,
            sku_code=container.sku_code,
            pick_list_code=container.pick_list_code
        )
        for container in containers
    ]


def get_all_clients(db: Session):
    clients = db.query(
        BusinessEntityMaster.business_entity_name).where(BusinessEntityMaster.is_client).distinct().all()
    return ['All'] + [client.business_entity_name for client in clients]


def get_all_vendors(db: Session):
    vendors = db.query(
        BusinessEntityMaster.business_entity_name).where(BusinessEntityMaster.is_vendor).distinct().all()
    return ['All'] + [vendor.business_entity_name for vendor in vendors]


def get_client_report(db: Session, client_name: str):
    clients = get_all_clients(db)
    if client_name.lower() == 'all':
        containers = db.query(
            ContainerMovement.business_entity_name,
            ContainerMovement.scanning_dt,
            ContainerMovement.container_category,
            ContainerMovement.container_code,
            ContainerMovement.rfid_tag_no
        ).filter(ContainerMovement.business_entity_name.in_(clients)).order_by(
            asc(ContainerMovement.business_entity_name),
            asc(ContainerMovement.scanning_dt),
            asc(ContainerMovement.container_category)
        ).all()
    else:
        containers = db.query(
            ContainerMovement.business_entity_name,
            ContainerMovement.scanning_dt,
            ContainerMovement.container_category,
            ContainerMovement.container_code,
            ContainerMovement.rfid_tag_no
        ).filter(ContainerMovement.business_entity_name == client_name).order_by(
            asc(ContainerMovement.business_entity_name),
            asc(ContainerMovement.scanning_dt),
            asc(ContainerMovement.container_category)
        ).all()

    return [
        ClientWiseContainerDetailsSchema(
            business_entity_name=container.business_entity_name,
            datetime=container.scanning_dt,
            container_category=container.container_category,
            container_code=container.container_code,
            rfid_tag_no=container.rfid_tag_no
        )
        for container in containers]


def get_vendor_report(db: Session, vendor_name: str):
    vendors = get_all_vendors(db)
    if vendor_name.lower() == 'all':
        containers = db.query(
            ContainerMovement.business_entity_name,
            ContainerMovement.scanning_dt,
            ContainerMovement.container_category,
            ContainerMovement.container_code,
            ContainerMovement.rfid_tag_no
        ).filter(ContainerMovement.business_entity_name.in_(vendors)).order_by(
            asc(ContainerMovement.business_entity_name),
            asc(ContainerMovement.scanning_dt),
            asc(ContainerMovement.container_category)
        ).all()
    else:
        containers = db.query(
            ContainerMovement.business_entity_name,
            ContainerMovement.scanning_dt,
            ContainerMovement.container_category,
            ContainerMovement.container_code,
            ContainerMovement.rfid_tag_no
        ).filter(ContainerMovement.business_entity_name == vendor_name).order_by(
            asc(ContainerMovement.business_entity_name),
            asc(ContainerMovement.scanning_dt),
            asc(ContainerMovement.container_category)
        ).all()

    return [
        VendorWiseContainerDetailsSchema(
            business_entity_name=container.business_entity_name,
            datetime=container.scanning_dt,
            container_category=container.container_category,
            container_code=container.container_code,
            rfid_tag_no=container.rfid_tag_no
        ) for container in containers]


def fetch_business_entity_names(db: Session):
    business_entity_names = db.query(
        BusinessEntityMaster.business_entity_name).distinct().all()
    return [business.business_entity_name for business in business_entity_names]
