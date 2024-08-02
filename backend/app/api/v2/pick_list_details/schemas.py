from pydantic import BaseModel


class PickListDetailsSchema(BaseModel):
    pick_list_master_id: int
    sku_master_id: int
    sku_code: str
    quantity: int

    class Config:
        from_attributes = True


class PickListResponseSchema(BaseModel):
    pick_list_master_id: int
    pick_list_code: str
    sku_master_id: int
    sku_code: str
    sku_name: str
    quantity: int


class PickListCreateSchema(BaseModel):
    pick_list_master_id: int
    sku_master_id: int
    quantity: int

    class Config:
        from_attributes = True
