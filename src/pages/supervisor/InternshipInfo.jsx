import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SupervisorNavbar from "../../components/navbar/SupervisorNavbar";
import { Table, Modal, Button, Space, Radio, Input, message, Tag } from "antd";
import { FileTextTwoTone, DownloadOutlined, CheckCircleFilled, CloseCircleFilled, CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons";
import { saveAs } from "file-saver";
import moment from "moment";

const InternshipInfo = () => {
  const supervisorId = useSelector((state) => state.auth.userId);
  const [size, setSize] = useState('large');
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchInternships = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/supervisors/${supervisorId}/internships`);
      console.log(response.data);
      setDataSource(response.data.internships);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [supervisorId]);

  const columns = [
    {
      key: "1",
      title: "Full Name",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "Company",
      dataIndex: "companyName",
    },
    {
      key: "3",
      title: "Start Date",
      dataIndex: "startDate",
      render: (startDate) => moment(startDate).format("YYYY-MM-DD"),
    },
    {
      key: "4",
      title: "End Date",
      dataIndex: "endDate",
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      key: "5",
      title: "Approve of Internship Book",
      render: (record) => (
        <Space className="flex flex-wrap gap-4">
          <Button
            type="link"
            onClick={() => {
              setModalVisible(record.key);
            }}
          >
            <FileTextTwoTone style={{ fontSize: 25 }} />
          </Button>
          <span>{record.internshipBookStatus}</span>
        </Space>
      ),
    },
    {
      key: "6",
      title: "Internship Book",
      render: (record) => (
        <Space>
          {record.internshipBook && record.internshipBook.contentType ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadInternshipBook(record.key)}
            >
              Download
            </Button>
          ) : null}
        </Space>
      ),
    },
    {
      key: "7",
      title: "Status",
      render: (record) => (
        <Space>
          {record.status === "APPROVED" ? (
            <Tag color="green">Approved</Tag>
          ) : record.status === "REJECTED" ? (
            <Tag color="red">Rejected</Tag>
          ) : (
            <Tag color="default">Pending</Tag>
          )}
        </Space>
      ),
    },
    {
      key: "8",
      title: "Evaluation Form",
      render: (record) => (
        <Space>
          {record.evaluationForm && record.evaluationForm.contentType ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadEvaluationForm(record.key)}
            >
              Download
            </Button>
          ) : null}
        </Space>
      ),
    },
    {
      key: "9",
      title: "Approve",
      render: (record) => (
        <Button onClick={() => onApproveStudent(record)} type="link">
          <CheckSquareFilled style={{ color: "green", fontSize: 35 }} />
        </Button>
      ),
    },
    {
      key: "10",
      title: "Reject",
      render: (record) => (
        <Button type="link" onClick={() => onRejectStudent(record)}>
          <CloseSquareFilled style={{ color: "red", fontSize: 35 }} />
        </Button>
      ),
    },
  ];

  const onApproveStudent = (record) => {
    Modal.confirm({
      title: "Are you sure you want to approve this internship?",
      okText: "Yes",
      okType: "primary",
      onOk: async () => {
        try {
          console.log(record.key)
          await axios.patch(`http://localhost:5000/api/internships/${record.key}/status`, { status: "APPROVED" });
          const successModal = Modal.success({
            content: "The internship has been approved.",
            footer: null, 
          });
          setTimeout(() => {
            successModal.destroy();
          }, 2000);
          fetchInternships();
        } catch (error) {
          throw new Error("Failed to approve internship: " + error.message);
        }
      },
    });
  };

  const onRejectStudent = (record) => {
    Modal.confirm({
      title: "Are you sure you want to reject this internship?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.patch(`http://localhost:5000/api/internships/${record.key}/status`, { status: "REJECTED" });
          fetchInternships();
        } catch (error) {
          throw new Error("Failed to reject internship: " + error.message);
        }
      },
    });
  };



  const closeModal = () => {
    setModalVisible(false);
    setRejectionReason("");
  };

  const handleApprove = (id) => {
    const updatedDataSource = dataSource.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: "APPROVED",
        };
      }
      return item;
    });

    setDataSource(updatedDataSource);
    setModalVisible(false);
    setRejectionReason("");
    axios.put(`http://localhost:5000/api/internships/${id}`, { newStatus: "APPROVED" })
      .then((response) => {
        fetchInternships();

        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Failed to update internship book status:", error);
      });
  };

  const handleReject = (id) => {
    if (rejectionReason.trim() === "") {
      message.warning("Please provide feedback for the rejection.");
      return;
    }

    const updatedDataSource = dataSource.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: "REJECTED",
          bookComment: rejectionReason, 
        };
      }
      return item;
    });

    setDataSource(updatedDataSource);
    setModalVisible(false);
    setRejectionReason("");
    axios
      .put(`http://localhost:5000/api/internships/${id}`, {
        newStatus: "REJECTED",
        rejectionReason: rejectionReason,
      })
      .then((response) => {
        fetchInternships();
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Failed to update internship status:", error);
      });
  };



  const getFilenameFromResponse = (response, fileType) => {
    const contentDispositionHeader = response.headers["content-disposition"];
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDispositionHeader);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, "");
    }
    return `${fileType}.pdf`;
  };

  const downloadInternshipBook = (internshipId) => {
    axios({
      url: `http://localhost:5000/api/internships/${internshipId}/internshipbook`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const filename = getFilenameFromResponse(response, "internship-book");
        const blob = new Blob([response.data], { type: "application/pdf" });
        saveAs(blob, filename);
      })
      .catch((error) => {
        console.error("Error downloading internship book:", error);
        message.error("Failed to download internship book");
      });
  };

  const downloadEvaluationForm = (internshipId) => {
    axios({
      url: `http://localhost:5000/api/internships/${internshipId}/evaluationform`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const filename = getFilenameFromResponse(response, "evaluation-form");
        const blob = new Blob([response.data], { type: "application/pdf" });
        saveAs(blob, filename);
      })
      .catch((error) => {
        console.error("Error downloading evaluation form:", error);
        message.error("Failed to download evaluation form");
      });
  };


  return (
    <>
      <SupervisorNavbar />
      <div className="px-6 py-6 w-4/5 mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Internship Informations
        </h1>
        <Table columns={columns} dataSource={dataSource} />

        <Modal
          title={<div className="text-center">Internship Book</div>}
          visible={modalVisible !== false}
          onCancel={closeModal}
          footer={[
            <Button type="primary" onClick={() => handleApprove(modalVisible)}>
              Approve
            </Button>,
            <Button onClick={() => handleReject(modalVisible)}>Reject</Button>,
          ]}
        >
          <span className="flex justify-center">
            Do you approve the internship book?
          </span>
          <div className="mt-4">
            <Input.TextArea
              placeholder="Enter the feedback for the internship notebook"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default InternshipInfo;