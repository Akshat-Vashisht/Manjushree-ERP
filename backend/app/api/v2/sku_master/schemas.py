from pydantic import BaseModel
from datetime import datetime


class SKUSchema(BaseModel):
    sku_master_id: int
    sku_code: str
    sku_name: str
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

    class Config:
        from_attributes = True

class SKUCreateSchema(BaseModel):
    sku_code: str
    sku_name: str
