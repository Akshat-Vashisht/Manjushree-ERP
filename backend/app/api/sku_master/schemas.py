from pydantic import BaseModel
from datetime import datetime


class SKUSchema(BaseModel):
    sku_master_id: int
    sku_code: str
    sku_name: str
    is_active: bool
    last_update_dt: datetime
    last_update_by: str

    class Config:
        orm_mode = True
