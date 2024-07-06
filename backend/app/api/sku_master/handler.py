from sqlalchemy.orm import Session
from ...models import SKUMaster


def fetch_scan_locations(db: Session):
    sku_list = db.query(SKUMaster).all()
    return sku_list