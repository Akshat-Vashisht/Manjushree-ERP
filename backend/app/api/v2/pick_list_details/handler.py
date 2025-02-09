from sqlalchemy.orm import Session
from ....models import PickListDetails, SKUMaster, PickListMaster
from .schemas import PickListCreateSchema, PickListResponseSchema
from ....utils import fetch_data
from ....exceptions import DataNotFoundError


def fetch_pick_list_details(db: Session, pick_list_details_id: int):

    pick_list_details = fetch_data(
        db, PickListDetails, 'pick_list_details_id', pick_list_details_id)

    sku = fetch_data(
        db, SKUMaster, 'sku_master_id', pick_list_details.sku_master_id)
    pick_list = fetch_data(
        db, PickListMaster, 'pick_list_master_id', pick_list_details.pick_list_master_id)

    result = PickListResponseSchema(
        pick_list_master_id=pick_list_details.pick_list_master_id,
        pick_list_code=pick_list.pick_list_code,
        sku_master_id=pick_list_details.sku_master_id,
        sku_code=sku.sku_code,
        sku_name=sku.sku_name,
        quantity=pick_list_details.quantity
    )

    return result


def fetch_all_pick_list_details(db: Session):

    pick_list_details = db.query(PickListDetails).all()
    result = []

    for pick_list_detail in pick_list_details:
        sku = fetch_data(
            db, SKUMaster, 'sku_master_id', pick_list_detail.sku_master_id)
        pick_list = fetch_data(
            db, PickListMaster, 'pick_list_master_id', pick_list_detail.pick_list_master_id)

        result.append(
            PickListResponseSchema(
                pick_list_master_id=pick_list_detail.pick_list_master_id,
                pick_list_code=pick_list.pick_list_code,
                sku_master_id=pick_list_detail.sku_master_id,
                sku_code=sku.sku_code,
                sku_name=sku.sku_name,
                quantity=pick_list_detail.quantity
            )
        )

    return result


def create_pick_list_details(db: Session, pick_list_details: list[PickListCreateSchema], allow_partial_inserts: bool):

    new_pick_list_details = []

    for pick_list_detail in pick_list_details:
        try:
            sku = fetch_data(
                db, SKUMaster, 'sku_master_id', pick_list_detail.sku_master_id)
            _ = fetch_data(db, PickListMaster,
                           'pick_list_master_id', pick_list_detail.pick_list_master_id)

            new_pick_list_detail = PickListDetails(
                pick_list_master_id=pick_list_detail.pick_list_master_id,
                sku_master_id=pick_list_detail.sku_master_id,
                sku_code=sku.sku_code,
                quantity=pick_list_detail.quantity,
            )
            new_pick_list_details.append(new_pick_list_detail)

        except DataNotFoundError as e:
            if allow_partial_inserts:
                continue
            else:
                db.rollback()
                raise e
    
    if new_pick_list_details and allow_partial_inserts:
        db.bulk_save_objects(new_pick_list_details)
        db.commit()

    return new_pick_list_details


def update_pick_list_details(db: Session, pick_list_details_id: int, quantity: int):

    pick_list_detail = fetch_data(
        db, PickListDetails, 'pick_list_details_id', pick_list_details_id)

    pick_list_detail.quantity = quantity

    db.commit()
    db.refresh(pick_list_detail)


def delete_pick_list_details(db: Session, pick_list_details_id: int):

    pick_list_detail = fetch_data(
        db, PickListDetails, 'pick_list_details_id', pick_list_details_id)

    db.delete(pick_list_detail)
    db.commit()
