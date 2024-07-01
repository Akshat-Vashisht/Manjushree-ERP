from fastapi import Depends, FastAPI, status
from fastapi.responses import JSONResponse
from .container_master.router import router as container_master_router
from .utils import get_db
from sqlalchemy.orm import Session

app = FastAPI(debug=True)
app.include_router(container_master_router)


@app.get('/health-check')
async def root(db: Session = Depends(get_db)):
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "working"})
