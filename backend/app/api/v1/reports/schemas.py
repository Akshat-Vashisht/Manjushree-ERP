from pydantic import BaseModel
from datetime import datetime


class AllContainerDetailsSchema(BaseModel):
    business_entity_name: str
    datetime: datetime
    container_category: str
    container_code: str
    rfid_tag_no: str


class ContainerDetailsManjushreeSchema(BaseModel):
    datetime: datetime
    container_location: str
    container_category: str
    container_code: str
    rfid_tag_no: str
    sku_code: str | None
    pick_list_code: str | None


class ClientWiseContainerDetailsSchema(BaseModel):
    business_entity_name: str
    datetime: datetime
    container_category: str
    container_code: str
    rfid_tag_no: str


class VendorWiseContainerDetailsSchema(BaseModel):
    business_entity_name: str
    datetime: datetime
    container_category: str
    container_code: str
    rfid_tag_no: str
