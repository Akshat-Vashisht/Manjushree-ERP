from pydantic import BaseModel, constr, Field
from datetime import datetime
from typing import Optional, Type, Union, Annotated
import inspect

from fastapi import Form, UploadFile, File

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
    # logo: Optional[bytes] = None
    is_client: bool
    is_vendor: bool
    is_transporter: bool
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

    class Config:
        from_attributes = True

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
    logo: Optional[bytes] = None
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
    logo: Optional[bytes] = None
    is_client: bool = False
    is_vendor: bool = False
    is_transporter: bool = False

class CreateForm:
    def __init__(
        self, 
        business_entity_code: str = Form(max_length=10),
        business_entity_name: str = Form(max_length=100),
        address: str = Form(max_length=400),
        city: str = Form(max_length=50),
        district: Optional[str] = Form(max_length=50, default=None),
        state: Optional[str] = Form(max_length=50, default=None) ,
        country: Optional[str] = Form(max_length=50, default=None) ,
        pin: int = Form(ge=100000, le=999999, default=100000),
        telephone_no1: Optional[str] = Form(max_length=20, default=None),
        mobile_no1: Optional[str] = Form(max_length=15, default=None),
        email_id: Optional[str] = Form(max_length=100, default=None),
        # logo = Annotated[bytes, File()],
        is_client: bool = Form(default=False),
        is_vendor: bool = Form(default=False),
        is_transporter: bool = Form(default=False),
    ):
        self.business_entity_code = business_entity_code
        self.business_entity_name = business_entity_name
        self.address = address
        self.city = city
        self.district = district
        self.state = state
        self.country = country
        self.pin = pin
        self.telephone_no1 = telephone_no1
        self.mobile_no1 = mobile_no1
        self.email_id = email_id
        # self.logo = logo
        self.is_client = is_client
        self.is_vendor = is_vendor
        self.is_transporter = is_transporter

    def to_dict(self):
        return {
            "business_entity_code":  self.business_entity_code,
            "business_entity_name":  self.business_entity_name,
            "address":  self.address,
            "city":  self.city,
            "district":  self.district,
            "state":  self.state,
            "country":  self.country,
            "pin":  self.pin,
            "telephone_no1":  self.telephone_no1,
            "mobile_no1":  self.mobile_no1,
            "email_id":  self.email_id,
            "is_client":  self.is_client,
            "is_vendor":  self.is_vendor,
            "is_transporter":  self.is_transporter
        }