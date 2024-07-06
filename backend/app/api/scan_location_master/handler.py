from sqlalchemy.orm import Session
from ...models import ScanLocationMaster


def fetch_scan_locations(db: Session):
    scan_locations = db.query(ScanLocationMaster).all()
    return scan_locations