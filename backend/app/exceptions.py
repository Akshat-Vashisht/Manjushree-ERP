class DataNotFoundError(ValueError):
    def __init__(self, id_name, id_value):
        self.id_name = id_name
        self.id_value = id_value
        super().__init__(f"No data found for '{id_name}' with ID '{id_value}'")
