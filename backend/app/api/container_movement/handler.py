import datetime
from sqlalchemy.orm import Session
from .schemas import ContainerMovementCreateSchema
from ...models import ContainerCategoryMaster, ContainerMaster, ContainerMovement, ContainerMovementHistory, SKUMaster, BusinessEntityMaster, PickListMaster, ScanLocationMaster, RFIDReaderMaster
from ...utils import fetch_data
from ...exceptions import DataNotFoundError


def get_values(db: Session, container_movement_input: ContainerMovementCreateSchema):
    container = fetch_data(db, ContainerMaster, 'container_master_id',
                           container_movement_input.container_master_id)
    if not container:
        raise DataNotFoundError('container_master_id',
                                container_movement_input.container_master_id)

    container_category = fetch_data(
        db, ContainerCategoryMaster, 'container_category_master_id', container.container_category_master_id)
    if not container_category:
        raise DataNotFoundError(
            'container_category_master_id', container.container_category_master_id)

    location = fetch_data(db, ScanLocationMaster, 'scan_location_master_id',
                          container_movement_input.scan_location_master_id)
    if not location:
        raise DataNotFoundError('scan_location_master_id',
                                container_movement_input.scan_location_master_id)

    rfid_reader = fetch_data(db, RFIDReaderMaster, 'rfid_reader_master_id',
                             container_movement_input.rfid_reader_master_id)
    if not rfid_reader:
        raise DataNotFoundError('rfid_reader_master_id',
                                container_movement_input.rfid_reader_master_id)

    sku = None
    if container_movement_input.sku_master_id:
        sku = fetch_data(db, SKUMaster, 'sku_master_id',
                         container_movement_input.sku_master_id)
        if not sku:
            raise DataNotFoundError(
                'sku_master_id', container_movement_input.sku_master_id)

    business_entity = None
    if container_movement_input.business_entity_master_id:
        business_entity = fetch_data(db, BusinessEntityMaster, 'business_entity_master_id',
                                     container_movement_input.business_entity_master_id)
        if not business_entity:
            raise DataNotFoundError(
                'business_entity_master_id', container_movement_input.business_entity_master_id)

    pick_list = None
    if container_movement_input.pick_list_master_id:
        pick_list = fetch_data(db, PickListMaster, 'pick_list_master_id',
                               container_movement_input.pick_list_master_id)
        if not pick_list:
            raise DataNotFoundError(
                'pick_list_master_id', container_movement_input.pick_list_master_id)

    values = {
        'container': container,
        'container_category': container_category,
        'location': location,
        'rfid_reader': rfid_reader,
        'sku': sku,
        'business_entity': business_entity,
        'pick_list': pick_list
    }

    return values


def set_container_movement_values(container_movement, values, container_movement_input):
    container_movement.container_master_id = container_movement_input.container_master_id
    container_movement.rfid_tag_no = container_movement_input.rfid_tag_no
    container_movement.scan_location_master_id = container_movement_input.scan_location_master_id
    container_movement.rfid_reader_master_id = container_movement_input.rfid_reader_master_id
    container_movement.sku_master_id = values['sku'].sku_master_id if values['sku'] else None
    container_movement.business_entity_master_id = values[
        'business_entity'].business_entity_master_id if values['business_entity'] else None
    container_movement.pick_list_master_id = values[
        'pick_list'].pick_list_master_id if values['pick_list'] else None
    container_movement.container_category = values['container_category'].container_category
    container_movement.container_code = values['container_category'].container_category_code
    container_movement.location_code = values['location'].location_code
    container_movement.location_name = values['location'].location_name
    container_movement.location_display_text = values['location'].location_display_text
    container_movement.sku_code = values['sku'].sku_code if values['sku'] else None
    container_movement.sku_name = values['sku'].sku_name if values['sku'] else None
    container_movement.business_entity_code = values[
        'business_entity'].business_entity_code if values['business_entity'] else None
    container_movement.business_entity_name = values[
        'business_entity'].business_entity_name if values['business_entity'] else None
    container_movement.pick_list_code = values['pick_list'].pick_list_code if values['pick_list'] else None
    container_movement.scanning_dt = datetime.datetime.now(
        datetime.timezone.utc)
    container_movement.scanning_done_by = container_movement_input.scanning_done_by


def insert_container(db: Session, container_movement_input: ContainerMovementCreateSchema):

    values = get_values(db, container_movement_input)
    new_container_movement = ContainerMovement()
    set_container_movement_values(
        new_container_movement, values, container_movement_input)

    db.add(new_container_movement)
    db.commit()
    db.refresh(new_container_movement)

    return new_container_movement


def update_container(db: Session, container_movement_input: ContainerMovementCreateSchema, container_movement: ContainerMovement):

    values = get_values(db, container_movement_input)
    set_container_movement_values(
        container_movement, values, container_movement_input)
    db.commit()
    db.refresh(container_movement)

    return container_movement


def upsert_container_movement(db: Session, container_movement_input: ContainerMovementCreateSchema):

    container_movement = db.query(ContainerMovement).filter(
        ContainerMovement.container_master_id == container_movement_input.container_master_id).first()

    if container_movement:
        upserted_container = update_container(
            db, container_movement_input, container_movement)
    else:
        upserted_container = insert_container(db, container_movement_input)

    container_movement_history = ContainerMovementHistory(
        container_master_id=upserted_container.container_master_id,
        rfid_tag_no=upserted_container.rfid_tag_no,
        scan_location_master_id=upserted_container.scan_location_master_id,
        rfid_reader_master_id=upserted_container.rfid_reader_master_id,
        sku_master_id=upserted_container.sku_master_id,
        business_entity_master_id=upserted_container.business_entity_master_id,
        pick_list_master_id=upserted_container.pick_list_master_id,
        container_category=upserted_container.container_category,
        container_code=upserted_container.container_code,
        location_code=upserted_container.location_code,
        location_name=upserted_container.location_name,
        location_display_text=upserted_container.location_display_text,
        sku_code=upserted_container.sku_code,
        sku_name=upserted_container.sku_name,
        business_entity_code=upserted_container.business_entity_code,
        business_entity_name=upserted_container.business_entity_name,
        pick_list_code=upserted_container.pick_list_code,
        scanning_dt=upserted_container.scanning_dt,
        scanning_done_by=upserted_container.scanning_done_by,
        transaction_dt=datetime.datetime.now(datetime.timezone.utc),
        transaction_by=upserted_container.scanning_done_by
    )

    db.add(container_movement_history)
    db.commit()
    db.refresh(container_movement_history)

    return container_movement_history
