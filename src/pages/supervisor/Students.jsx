import SupervisorNavbar from "../../components/navbar/SupervisorNavbar";
import { Table, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";

const Students = () => {
  const supervisorId = useSelector((state) => state.auth.userId);
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/supervisors/${supervisorId}/students`);
      setDataSource(response.data.map((student, index) => ({ ...student, key: index })));
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };


  useEffect(() => {
    fetchStudents();
  }, [supervisorId]);


  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "surname",
      title: "Surname",
      dataIndex: "surname",
    },
    {
      key: "studentNumber",
      title: "Student Number",
      dataIndex: "studentNumber",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "delete",
      title: "Delete",
      render: (record) => (
        <DeleteOutlined
          onClick={() => {
            onDeleteStudent(record);
          }}
          style={{ color: "red", fontSize: 18 }}
        />
      ),
    },
  ];

  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteStudent(record._id);
      },
    });
  };

  const deleteStudent = (studentId) => {
    setDataSource((prev) =>
      prev.filter((student) => student.key !== studentId)
    );
    axios
      .delete(`http://localhost:5000/api/students/${studentId}`)
      .then((response) => {
        console.log("Student deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const expandedRowRender = (record) => {
    const {
      classYear,
      gpa,
      phone,
      address,
      departmentName,
    } = record;
    return (
      <ul>
        <li>Class Year: {classYear}</li>
        <li>GPA: {gpa}</li>
        <li>Phone: {phone}</li>
        <li>Address: {address}</li>
        <li>Department: {departmentName}</li>
      </ul>
    );
  };

  return (
    <>
      <SupervisorNavbar />
      <div className="px-6 py-6">
        <h1 className="text-4xl font-bold text-center mb-4">
          Students
        </h1>
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
          onRow={(record) => {
            return {
              onClick: () => {
                const index = expandedRowKeys.indexOf(record.key);
                const newExpandedRowKeys = index >= 0 ? [] : [record.key];
                setExpandedRowKeys(newExpandedRowKeys);
              },
            };
          }}
        />
      </div>
    </>
  );
};

export default Students;
