from pydantic import BaseModel, Field
from typing import List

class PickListSchema(BaseModel):
    pick_list_code: str
    business_entity_code: str
    invoice_number: str
    
    class Config:
        from_attributes = True
    
class PickListDetailSchema(BaseModel):
    line_no: int
    sku_code: str
    quantity: int
    
    class Config:
        from_attributes = True

class CreatePickListSchema(BaseModel):
    pick_list_code: str = Field(max_length=50, min_length=1)
    business_entity_code: str = Field(max_length=50, min_length=1)
    invoice_no: str = Field(max_length=50, min_length=1)
    details: List[PickListDetailSchema]
    

    