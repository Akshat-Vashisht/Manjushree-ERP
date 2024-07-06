from sqlalchemy.orm import Session
from ...models import ContainerCategoryMaster


def fetch_container_category(db: Session):
    sku_list = db.query(ContainerCategoryMaster).all()
    return sku_list