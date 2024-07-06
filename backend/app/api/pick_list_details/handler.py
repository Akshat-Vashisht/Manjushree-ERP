from sqlalchemy.orm import Session
from ...models import PickListDetails, SKUMaster, PickListMaster
from .schemas import PickListResponseSchema
from ...utils import fetch_data


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
