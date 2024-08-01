from sqlalchemy.orm import Session
from sqlalchemy import func
from ....models import ContainerMovement


def get_dashboard_4(db: Session):
    total_empty_count = db.query(func.count(ContainerMovement.container_movement_id)).filter(
        ContainerMovement.sku_master_id.is_(None),
        ContainerMovement.business_entity_name == 'Manjushree'
    ).scalar()

    location_wise_count = db.query(
        ContainerMovement.location_display_text,
        func.count(ContainerMovement.container_movement_id).label(
            'total_containers')
    ).filter(
        ContainerMovement.sku_master_id.is_(None),
        ContainerMovement.business_entity_name == 'Manjushree'
    ).group_by(ContainerMovement.location_display_text).all()

    response = {
        "total_count": total_empty_count,
        "location_wise_count": [
            {"location": location, "count": count} for location, count in location_wise_count
        ]
    }

    return response


def get_dashboard_3(db: Session):
    total_empty_count = db.query(func.count(ContainerMovement.container_movement_id)).filter(
        ContainerMovement.sku_master_id.is_(None),
        ContainerMovement.business_entity_name == 'Manjushree'
    ).scalar()

    category_wise_count = db.query(
        ContainerMovement.container_category,
        func.count(ContainerMovement.container_movement_id).label(
            'total_containers')
    ).filter(
        ContainerMovement.sku_master_id.is_(None),
        ContainerMovement.business_entity_name == 'Manjushree'
    ).group_by(ContainerMovement.container_category).all()

    response = {
        "total_count": total_empty_count,
        "category_wise_count": [
            {"category_name": category_name, "count": count} for category_name, count in category_wise_count
        ]
    }

    return response


def get_dashboard_2(db: Session):
    total_count = db.query(func.count(ContainerMovement.container_movement_id)).filter(
        ContainerMovement.business_entity_name == 'Manjushree'
    ).scalar()

    location_wise_count = db.query(
        ContainerMovement.location_display_text,
        func.count(ContainerMovement.container_movement_id).label(
            'total_containers')
    ).filter(
        ContainerMovement.business_entity_name == 'Manjushree'
    ).group_by(ContainerMovement.location_display_text).all()

    response = {
        "total_count": total_count,
        "location_wise_count": [
            {"location": location, "count": count} for location, count in location_wise_count
        ]
    }

    return response


def get_dashboard_1(db: Session):
    total_count = db.query(func.count(
        ContainerMovement.container_movement_id)).scalar()

    containers_manjushree = db.query(func.count(ContainerMovement.container_movement_id)).filter(
        ContainerMovement.business_entity_name == 'Manjushree'
    ).scalar()

    containers_not_manjushree = total_count - containers_manjushree

    response = {
        "total_count": total_count,
        "location_wise_count": [
            {"location": "At Manjushree", "count": containers_manjushree},
            {"location": "At Client", "count": containers_not_manjushree}
        ]
    }

    return response
