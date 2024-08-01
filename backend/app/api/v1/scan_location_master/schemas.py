from pydantic import BaseModel
from datetime import datetime


class ScanLocationMasterSchema(BaseModel):
    scan_location_master_id: int
    location_code: str
    location_name: str
    location_display_text: str
    is_active: bool
    last_updated_dt: datetime
    last_updated_by: int

    class Config:
        from_attributes = True

