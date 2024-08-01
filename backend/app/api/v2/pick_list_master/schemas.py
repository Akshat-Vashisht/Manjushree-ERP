from pydantic import BaseModel
from datetime import datetime

class PickListSchema(BaseModel):
    pick_list_master_id: int
    pick_list_code: str
    business_entity_code: str
    invoice_number: str
    pick_list_status: bool
    is_aborted: bool
    creation_dt: datetime
    closed_dt: datetime
    closed_by: int

    class Config:
        from_attributes = True