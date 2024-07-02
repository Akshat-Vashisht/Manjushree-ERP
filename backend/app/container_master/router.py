from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


from .schemas import Container, ContainerCreate
from sqlalchemy.orm import Session
from ..utils import get_db
from .handler import add_container, fetch_containers, soft_delete

router = APIRouter(
    prefix='/containers',
    tags=["container_master"]
)


@router.post('/', response_model=Container)
async def create_container(container: ContainerCreate, db: Session = Depends(get_db)):
    try:
        new_container = jsonable_encoder(add_container(db, container))
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"detail": new_container})
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": str(e)})


@router.get('/', response_model=list[Container])
async def get_containers(db: Session = Depends(get_db)):
    try:
        containers = jsonable_encoder(fetch_containers(db))
        return JSONResponse(status_code=status.HTTP_200_OK, content={"detail": containers})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": str(e)})


@router.patch('/{container_id}')
async def delete_container(
    container_id: int, 
    last_updated_by: int, 
    response: Response, 
    db: Session = Depends(get_db)):
    try:
        soft_delete(db, container_id, last_updated_by)
        response.status_code = status.HTTP_204_NO_CONTENT
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(e)})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": str(e)})
