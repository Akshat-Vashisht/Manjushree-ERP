from fastapi import HTTPException, status

class DataNotFoundError(ValueError):
    def __init__(self, id_name, id_value):
        self.id_name = id_name
        self.id_value = id_value
        super().__init__(f"No data found for '{id_name}' with ID '{id_value}'")

def not_found_exception(message: any) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)

def unique_validations_fail_exception(message: any) -> HTTPException: 
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)
        