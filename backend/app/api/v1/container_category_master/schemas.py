from pydantic import BaseModel
from datetime import datetime

class ContainerCategorySchema(BaseModel):
    container_category_master_id: int
    container_category_code: str
    container_category: str
    is_active: bool
    last_update_dt: datetime
    last_update_by: str

    class Config:
        from_attributes = True

class ContainerCategoryWithId(BaseModel):
    container_category_master_id: int
    container_category: str