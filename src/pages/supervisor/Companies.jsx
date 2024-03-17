import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import SupervisorNavbar from "../../components/navbar/SupervisorNavbar";

const Companies = () => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectedRecord, setRejectedRecord] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies");
        setDataSource(response.data.map((company, index) => ({ ...company, key: index })));
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchData();
  }, []);

  const deleteCompany = async (companyId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/companies/${companyId}`);
      if (response.status === 200) {
        setDataSource((prev) => prev.filter((company) => company.key !== companyId));
        message.success("Company deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      message.error("Failed to delete company. Please try again.");
    }
  };

  const handleReject = (record) => {
    setRejectedRecord(record);
    setRejectModalVisible(true);
  };

  const handleRejectModalOk = () => {
    setDataSource((prev) => {
      return prev.filter((company) => company.key !== rejectedRecord.key);
    });
    deleteCompany(rejectedRecord._id);
    setRejectModalVisible(false);
    setRejectedRecord(null);
  };

  const handleRejectModalCancel = () => {
    setRejectModalVisible(false);
    setRejectedRecord(null);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
    },
    {
      title: "Sector",
      dataIndex: "sector",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "Reject",
      render: (record) => (
        <Button onClick={() => handleReject(record)} type="link">
          <CloseSquareFilled style={{ color: "red", fontSize: 18 }} />
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div>
        <p>Contact Number: {record.contactNumber}</p>
        <p>Email: {record.email}</p>
        <p>Work Areas: {record.workAreas.join(", ")}</p>
        <p>Number of Employees: {record.employeeNum}</p>
      </div>
    );
  };

  return (
    <>
      <SupervisorNavbar />
      <div className="px-6 py-6">
        <h1 className="text-4xl font-bold text-center mb-4">Companies</h1>
        <Table
          className="px-20"
          columns={columns}
          dataSource={dataSource}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
            expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys([record.key]);
              } else {
                setExpandedRowKeys([]);
              }
            },
          }}
        />
      </div>

      <Modal
        title="Confirm Company Rejection"
        visible={rejectModalVisible}
        onOk={handleRejectModalOk}
        onCancel={handleRejectModalCancel}
        bodyStyle={{ paddingTop: 0 }} 
      >
        <p>Are you sure you want to reject this company?</p>
      </Modal>
    </>
  );
};

export default Companies;
