from pydantic import BaseModel
from datetime import datetime


class ContainerCreateSchema(BaseModel):
    container_category_master_id: int
    container_status: str
    rfid_tag_no: str
    last_updated_by: int


class ContainerSchema(BaseModel):
    container_master_id: int
    container_category_master_id: int
    container_code: str
    container_registration_dt: datetime
    container_status: str
    container_unregistered_date: datetime | None
    rfid_tag_no: str
    rfid_registration_dt: datetime
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

    class Config:
        from_attributes = True


class ContainerWithCategorySchema(BaseModel):
    container_master_id: int
    container_category_master_id: int
    container_code: str
    container_category: str
    container_registration_dt: datetime
    container_status: str
    container_unregistered_date: datetime | None
    rfid_tag_no: str
    rfid_registration_dt: datetime
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int


class ContainerUpdateSchema(BaseModel):
    container_master_id: int
    container_status: str
    rfid_tag_no: str
    last_updated_by: int
