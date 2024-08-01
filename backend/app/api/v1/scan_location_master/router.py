from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .schemas import ScanLocationMasterSchema
from ....utils import get_db
from .handler import fetch_scan_locations
from ....auth.handler import get_current_user

router = APIRouter()
router.dependencies = [Depends(get_current_user)]


@router.get('/', response_model=list[ScanLocationMasterSchema])
async def get_containers(db: Session = Depends(get_db)):
    try:
        scan_locations = jsonable_encoder(fetch_scan_locations(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={'detail': scan_locations})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': str(e)})
