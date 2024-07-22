from pydantic import BaseModel, constr, Field
from datetime import datetime
from typing import Optional

class BusinessEntitySchema(BaseModel):
    business_entity_master_id: int
    business_entity_code: str
    business_entity_name: str
    address: str
    city: str
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pin: int
    telephone_no1: Optional[str] = None
    mobile_no1: Optional[str] = None
    email_id: Optional[str] = None
    logo: Optional[str] = None
    is_client: bool
    is_vendor: bool
    is_transporter: bool
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

class BusinessEntityCreateSchema(BaseModel):
    business_entity_code: str = Field(max_length=10)
    business_entity_name: str = Field(max_length=100)
    address: str = Field(max_length=400)
    city: str = Field(max_length=50)
    district: Optional[str] = Field(max_length=50, default=None)
    state: Optional[str] = Field(max_length=50, default=None) 
    country: Optional[str] = Field(max_length=50, default=None) 
    pin: int = Field(ge=100000, le=999999, default=100000)
    telephone_no1: Optional[str] = Field(max_length=20, default=None)
    mobile_no1: Optional[str] = Field(max_length=15, default=None)
    email_id: Optional[str] = Field(max_length=100, default=None)
    logo: Optional[str] = None
    is_client: bool = False
    is_vendor: bool = False
    is_transporter: bool = False

class BusinessEntityUpdateSchema(BaseModel):
    business_entity_code: str = Field(max_length=10)
    business_entity_name: str = Field(max_length=100)
    address: str = Field(max_length=400)
    city: str = Field(max_length=50)
    district: Optional[str] = Field(max_length=50, default=None)
    state: Optional[str] = Field(max_length=50, default=None) 
    country: Optional[str] = Field(max_length=50, default=None) 
    pin: int = Field(ge=100000, le=999999, default=100000)
    telephone_no1: Optional[str] = Field(max_length=20, default=None)
    mobile_no1: Optional[str] = Field(max_length=15, default=None)
    email_id: Optional[str] = Field(max_length=100, default=None)
    logo: Optional[str] = None
    is_client: bool = False
    is_vendor: bool = False
    is_transporter: bool = False