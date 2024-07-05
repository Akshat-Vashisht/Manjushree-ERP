from datetime import datetime
from pydantic import BaseModel


class ContainerMovementCreateSchema(BaseModel):
    container_master_id: int
    rfid_tag_no: str
    scan_location_master_id: int
    rfid_reader_master_id: int
    sku_master_id: int | None = None
    business_entity_master_id: int | None = None
    pick_list_master_id: int | None = None
    scanning_done_by: int


class ContainerMovementSchema(BaseModel):
    container_movement_id: int
    container_master_id: int
    rfid_tag_no: str
    scan_location_master_id: int
    rfid_reader_master_id: int
    sku_master_id: int | None
    business_entity_master_id: int | None
    pick_list_master_id: int | None
    container_category: str | None
    container_code: str | None
    location_code: str | None
    location_name: str | None
    location_display_text: str | None
    sku_code: str | None
    sku_name: str | None
    business_entity_code: str | None
    business_entity_name: str | None
    pick_list_code: str | None
    scanning_dt: datetime
    scanning_done_by: int

    class Config:
        orm_mode = True