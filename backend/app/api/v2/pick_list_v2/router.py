from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select, insert
from sqlalchemy.orm import Session
from . import schemas
from ....utils import get_db
from ....models import PickListMaster, PickListDetails, SKUMaster, BusinessEntityMaster

router = APIRouter()


@router.post('/pick-list-v2', status_code=status.HTTP_201_CREATED)
def create_pick_list_v2(inputs: schemas.CreatePickListSchema, db: Session = Depends(get_db)):
    try:
        # Check if business entity exists
        entity = db.query(BusinessEntityMaster).filter(
            BusinessEntityMaster.business_entity_code == inputs.business_entity_code).first()

        if not entity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Business Entity {inputs.business_entity_code} does not exist")

        # Check if pick list already exists
        pick_list = db.query(PickListMaster).filter(
            PickListMaster.pick_list_code == inputs.pick_list_code).first()

        if pick_list:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Pick list {inputs.pick_list_code} already exists.")

        # Generate picklist data
        pick_list_data = {
            'pick_list_code': inputs.pick_list_code,
            'business_entity_code': inputs.business_entity_code,
            'invoice_number': inputs.invoice_no,
            'pick_list_status': True,
            'is_aborted': False,
            'closed_by': 1
        }

        pick_list = PickListMaster(**pick_list_data)

        # Generate sku_code -> sku_master_id mapping
        sku_code_list = [obj.sku_code for obj in inputs.details]

        stmt = select(SKUMaster.sku_code, SKUMaster.sku_master_id).where(
            SKUMaster.sku_code.in_(sku_code_list))

        results = db.execute(stmt).all()

        mappings = {sku_code: sku_master_id for sku_code,
                    sku_master_id in results}

        if len(sku_code_list) != len(mappings):
            non_existing_skus = []

            for sku_code in sku_code_list:
                if sku_code not in mappings:
                    non_existing_skus.append(sku_code)

            message = 'SKUs ' + ','.join(non_existing_skus) + " do not exist"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=message)

        # Generate pick_list_details data to be inserted
        pick_list_details = []

        for detail in inputs.details:
            _data = {
                'sku_master_id': mappings[detail.sku_code],
                'sku_code': detail.sku_code,
                'quantity': detail.quantity,
                # NOT CURRENTLY IN TABLE
                'line_no': detail.line_no
            }
            pick_list_details.append(PickListDetails(**_data))

        pick_list.details = pick_list_details

        db.add(pick_list)
        db.commit()

        return {"message": "Pick list created successfully"}
    except Exception as e:
        raise e
