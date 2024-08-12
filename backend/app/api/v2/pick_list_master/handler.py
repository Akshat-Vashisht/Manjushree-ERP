import datetime
from fastapi import Depends
from sqlalchemy.orm import Session

from ....auth.handler import get_current_user
from ....models import PickListMaster
from .schemas import PickListCreateSchema
from ....utils import fetch_data


def fetch_pick_list(db: Session, code: int):
    if code not in [0, 1, -1]:
        raise ValueError('Invalid code: code should be 0, 1 or -1')

    match code:
        case 0:
            pick_list_details = db.query(PickListMaster).filter(
                ~PickListMaster.pick_list_status).all()
            return pick_list_details
        case 1:
            pick_list_details = db.query(PickListMaster).filter(
                PickListMaster.pick_list_status).all()
            return pick_list_details
        case -1:
            pick_list_details = db.query(PickListMaster).all()
            return pick_list_details


def add_pick_list(db: Session, pick_list_array: list[PickListCreateSchema]):

    new_pick_list = []
    # TODO: Change hardcoded value (To be passed from the frontend)
    for pick_list in pick_list_array:

        pick_list_master = PickListMaster(
            pick_list_code=pick_list.pick_list_code,
            business_entity_code=pick_list.business_entity_code,
            invoice_number=pick_list.invoice_number,
            pick_list_status=True,
            is_aborted=False,
            creation_dt=datetime.datetime.now(datetime.UTC),
            closed_by=1
        )

        new_pick_list.append(pick_list_master)

    db.bulk_save_objects(new_pick_list)
    db.commit()
    
    return pick_list_master


def update_pick_list_status(db: Session, pick_list_id: int, ):
    pick_list = fetch_data(
        db, PickListMaster, "pick_list_master_id", pick_list_id)

    if pick_list.is_aborted:
        raise ValueError('Pick list is already aborted')
    pick_list.is_aborted = True
    pick_list.closed_dt = datetime.datetime.now(datetime.UTC)

    db.commit()
    db.refresh(pick_list)


def delete_pick_list_data(db: Session, pick_list_id: int):
    pick_list = fetch_data(
        db, PickListMaster, "pick_list_master_id", pick_list_id)

    db.delete(pick_list)
    db.commit()
