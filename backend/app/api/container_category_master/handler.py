from sqlalchemy.orm import Session
from ...models import ContainerCategoryMaster


def fetch_container_category(db: Session):
    container_category = db.query(ContainerCategoryMaster).all()
    return container_category


def fetch_container_id_and_category(db: Session):
    container_details = db.query(ContainerCategoryMaster.container_category_master_id,
                                 ContainerCategoryMaster.container_category).all()
    result = []
    for id, name in container_details:
        result.append({
            'id': id,
            'name': name
        })
    return result
