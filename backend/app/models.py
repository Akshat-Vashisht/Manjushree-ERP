from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, LargeBinary, Text
from sqlalchemy.orm import relationship
from .database import Base


class UserMaster(Base):
    __tablename__ = 'user_master'

    user_master_id = Column(Integer, primary_key=True, index=True)
    user_code = Column(String(10), nullable=False)
    user_name = Column(String(50), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)


class CompanyMaster(Base):
    __tablename__ = 'company_master'

    company_master_id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(125), unique=True, nullable=False)
    company_short_name = Column(String(30), unique=True, nullable=False)
    address = Column(String(400), nullable=False)
    city = Column(String(50), nullable=False)
    district = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    pin = Column(Integer, nullable=False)
    telephone_no1 = Column(String(20))
    mobile_no1 = Column(String(15))
    email_id = Column(String(100))
    logo = Column(String)  
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class BusinessEntityMaster(Base):
    __tablename__ = 'business_entity_master'

    business_entity_master_id = Column(Integer, primary_key=True, index=True)
    business_entity_code = Column(String(10), nullable=False)
    business_entity_name = Column(String(100), unique=True, nullable=False)
    address = Column(String(400), nullable=False)
    city = Column(String(50), nullable=False)
    district = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    pin = Column(Integer, nullable=False)
    telephone_no1 = Column(String(20))
    mobile_no1 = Column(String(15))
    email_id = Column(String(100))
    logo = Column(LargeBinary)  
    is_client = Column(Boolean, nullable=False)
    is_vendor = Column(Boolean, nullable=False)
    is_transporter = Column(Boolean, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class SKUMaster(Base):
    __tablename__ = 'sku_master'

    sku_master_id = Column(Integer, primary_key=True, index=True)
    sku_code = Column(String(10), nullable=False)
    sku_name = Column(Text, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class ScanLocationMaster(Base):
    __tablename__ = 'scan_location_master'

    scan_location_master_id = Column(Integer, primary_key=True, index=True)
    location_code = Column(String(5), nullable=False)
    location_name = Column(String(30), nullable=False)
    location_display_text = Column(String(100), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class RFIDReaderMaster(Base):
    __tablename__ = 'rfid_reader_master'

    rfid_reader_master_id = Column(Integer, primary_key=True, index=True)
    reader_code = Column(String(30), nullable=False)
    reader_registration_date = Column(DateTime, nullable=False)
    rfid_reader_status = Column(String(10), nullable=False)
    reader_type = Column(String(50), nullable=False)
    reader_location = Column(String(50))
    reader_unregistered_date = Column(DateTime)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class ContainerCategoryMaster(Base):
    __tablename__ = 'container_category_master'

    container_category_master_id = Column(
        Integer, primary_key=True, index=True)
    container_category_code = Column(String(3), nullable=False)
    container_category = Column(String(100), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)


class PickListMaster(Base):
    __tablename__ = 'pick_list_master'

    pick_list_master_id = Column(Integer, primary_key=True, index=True)
    pick_list_code = Column(String(10), nullable=False)
    business_entity_code = Column(String(10), nullable=False)
    invoice_number = Column(String(50), nullable=False)
    pick_list_status = Column(Boolean, nullable=False)
    is_aborted = Column(Boolean, nullable=False, default=False)
    creation_dt = Column(DateTime, nullable=False)
    closed_dt = Column(DateTime)
    closed_by = Column(Integer, nullable=False)


class ContainerMaster(Base):
    __tablename__ = 'container_master'

    container_master_id = Column(Integer, primary_key=True, index=True)
    container_category_master_id = Column(Integer, ForeignKey(
        'container_category_master.container_category_master_id'), nullable=False)
    container_code = Column(String(10))
    container_registration_dt = Column(DateTime, nullable=False)
    container_status = Column(String(10), nullable=False)
    container_unregistered_date = Column(DateTime, nullable=True)
    rfid_tag_no = Column(String(100))
    rfid_registration_dt = Column(DateTime)
    is_active = Column(Boolean, nullable=False, default=True)
    last_updated_dt = Column(DateTime, nullable=False)
    last_updated_by = Column(Integer, nullable=False)

    category = relationship("ContainerCategoryMaster")


class ContainerMovement(Base):
    __tablename__ = 'container_movement'

    container_movement_id = Column(Integer, primary_key=True, index=True)
    container_master_id = Column(Integer, ForeignKey(
        'container_master.container_master_id'), nullable=False)
    rfid_tag_no = Column(String(100), nullable=False)
    scan_location_master_id = Column(Integer, ForeignKey(
        'scan_location_master.scan_location_master_id'), nullable=False)
    rfid_reader_master_id = Column(Integer, ForeignKey(
        'rfid_reader_master.rfid_reader_master_id'), nullable=False)
    sku_master_id = Column(Integer, ForeignKey('sku_master.sku_master_id'))
    business_entity_master_id = Column(Integer, ForeignKey(
        'business_entity_master.business_entity_master_id'))
    pick_list_master_id = Column(Integer, ForeignKey(
        'pick_list_master.pick_list_master_id'))
    container_category = Column(String(100))
    container_code = Column(String(30))
    location_code = Column(String(5))
    location_name = Column(String(30))
    location_display_text = Column(String(100))
    sku_code = Column(String(10))
    sku_name = Column(String(30))
    business_entity_code = Column(String(10))
    business_entity_name = Column(String(100))
    pick_list_code = Column(String(30))
    scanning_dt = Column(DateTime, nullable=False)
    scanning_done_by = Column(Integer, nullable=False)

    container_master = relationship("ContainerMaster")
    scan_location_master = relationship("ScanLocationMaster")
    rfid_reader_master = relationship("RFIDReaderMaster")
    sku_master = relationship("SKUMaster")
    business_entity_master = relationship("BusinessEntityMaster")
    pick_list_master = relationship("PickListMaster")


class ContainerMovementHistory(Base):
    __tablename__ = 'container_movement_history'

    container_movement_history_id = Column(
        Integer, primary_key=True, index=True)
    container_master_id = Column(Integer, ForeignKey(
        'container_master.container_master_id'), nullable=False)
    rfid_tag_no = Column(String(100), nullable=False)
    scan_location_master_id = Column(Integer, ForeignKey(
        'scan_location_master.scan_location_master_id'), nullable=False)
    rfid_reader_master_id = Column(Integer, ForeignKey(
        'rfid_reader_master.rfid_reader_master_id'), nullable=False)
    sku_master_id = Column(Integer, ForeignKey('sku_master.sku_master_id'))
    business_entity_master_id = Column(Integer, ForeignKey(
        'business_entity_master.business_entity_master_id'))
    pick_list_master_id = Column(Integer, ForeignKey(
        'pick_list_master.pick_list_master_id'))
    container_category = Column(String(100))
    container_code = Column(String(30))
    location_code = Column(String(5))
    location_name = Column(String(30))
    location_display_text = Column(String(100))
    sku_code = Column(String(10))
    sku_name = Column(String(30))
    business_entity_code = Column(String(10))
    business_entity_name = Column(String(100))
    pick_list_code = Column(String(30))
    scanning_dt = Column(DateTime, nullable=False)
    scanning_done_by = Column(Integer, nullable=False)
    transaction_dt = Column(DateTime, nullable=False)
    transaction_by = Column(Integer, nullable=False)

    container_master = relationship("ContainerMaster")
    scan_location_master = relationship("ScanLocationMaster")
    rfid_reader_master = relationship("RFIDReaderMaster")
    sku_master = relationship("SKUMaster")
    business_entity_master = relationship("BusinessEntityMaster")
    pick_list_master = relationship("PickListMaster")


class PickListDetails(Base):
    __tablename__ = 'pick_list_details'

    pick_list_details_id = Column(Integer, primary_key=True, index=True)
    pick_list_master_id = Column(Integer, ForeignKey(
        'pick_list_master.pick_list_master_id'), nullable=False)
    sku_master_id = Column(Integer, ForeignKey(
        'sku_master.sku_master_id'), nullable=False)
    sku_code = Column(String(10), nullable=False)
    quantity = Column(Integer, nullable=False)

    pick_list_master = relationship("PickListMaster")
    sku_master = relationship("SKUMaster")
