from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from ...auth.handler import get_current_user
from ...utils import get_db
from .schemas import AllContainerDetailsSchema, ContainerDetailsManjushreeSchema
from .handler import get_all_containers_details, get_containers_at_manjushree_details, get_all_clients, get_client_report, get_all_vendors, get_vendor_report, fetch_business_entity_names

router = APIRouter(
    prefix='/reports',
    tags=['reports']
)
router.dependencies = [Depends(get_current_user)]


@router.get('/all-containers', response_model=list[AllContainerDetailsSchema])
async def fetch_all_containers(db: Session = Depends(get_db)):
    try:
        containers = jsonable_encoder(get_all_containers_details(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=containers)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/containers-at-manjushree', response_model=list[ContainerDetailsManjushreeSchema])
async def fetch_containers_at_manjushree(db: Session = Depends(get_db)):
    try:
        containers = jsonable_encoder(get_containers_at_manjushree_details(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=containers)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/get-clients')
async def get_clients(db: Session = Depends(get_db)):
    clients = get_all_clients(db)
    return clients


@router.get('/get-client-report/{client_name}')
async def get_client(client_name: str, db: Session = Depends(get_db)):
    try:
        client_report = jsonable_encoder(get_client_report(db, client_name))
        return JSONResponse(status_code=status.HTTP_200_OK, content=client_report)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/get-vendors')
async def get_vendors(db: Session = Depends(get_db)):
    vendors = get_all_vendors(db)
    return vendors


@router.get('/get-vendor-report/{vendor_name}')
async def get_vendor(vendor_name: str, db: Session = Depends(get_db)):
    try:
        vendor_report = jsonable_encoder(get_vendor_report(db, vendor_name))
        return JSONResponse(status_code=status.HTTP_200_OK, content=vendor_report)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})


@router.get('/business-entity-names')
async def get_business_entity_names(db: Session = Depends(get_db)):
    try:
        businesses = jsonable_encoder(fetch_business_entity_names(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content=businesses)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
