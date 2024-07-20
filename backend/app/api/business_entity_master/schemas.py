from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BusinessEntitySchema(BaseModel):
    business_entity_master_id: int
    business_entity_code: str
    business_entity_name: str
    address: str
    city: str
    district: str
    state: str
    country: str
    pin: int
    telephone_no1: str
    mobile_no1: str
    email_id: str
    logo: str
    is_client: bool
    is_vendor: bool
    is_transporter: bool
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

class BusinessEntityCreateSchema(BaseModel):
    business_entity_code: str
    business_entity_name: str
    address: str
    city: str
    district: Optional[str]
    state: Optional[str]
    country: Optional[str]
    pin: int
    telephone_no1: Optional[str]
    mobile_no1: Optional[str]
    email_id: Optional[str]
    logo: Optional[str]
    is_client: bool
    is_vendor: bool
    is_transporter: bool
    is_active: bool