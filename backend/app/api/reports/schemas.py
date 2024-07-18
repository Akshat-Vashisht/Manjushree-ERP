from pydantic import BaseModel
from datetime import date, time


class AllContainerDetailsSchema(BaseModel):
    business_entity_name: str
    date: date
    time: time
    container_category: str
    container_code: str
    rfid_tag_no: str


class ContainerDetailsManjushreeSchema(BaseModel):
    date: date
    time: time
    container_location: str
    container_category: str
    container_code: str
    rfig_tag_no: str
    sku_code: str | None
    pick_list_code: str | None


class ClientWiseContainerDetailsSchema(BaseModel):
    business_entity_name: str
    date: date
    time: time
    container_category: str
    container_code: str
    rfid_tag_no: str


class VendorWiseContainerDetailsSchema(BaseModel):
    business_entity_name: str
    date: date
    time: time
    container_category: str
    container_code: str
    rfid_tag_no: str
