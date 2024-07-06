from sqlalchemy.orm import Session
from ...models import PickListMaster


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
