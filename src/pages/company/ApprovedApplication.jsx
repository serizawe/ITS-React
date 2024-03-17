import CompanyNavbar from "../../components/navbar/CompanyNavbar";
import { Table, Modal, Button, Space, Upload, message, Popconfirm, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  FileTextTwoTone,
  UploadOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { saveAs } from "file-saver";

const ApprovedApplication = () => {
  const companyId = useSelector((state) => state.auth.userId);
  const [dataSource, setDataSource] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);


  const columns = [
    {
      key: "1",
      title: "Full Name",
      render: (record) => `${record.student.name} ${record.student.surname}`,
    },
    {
      key: "2",
      title: "Dates of Internship",
      render: (record) => (
        <>
          {moment(record.startDate).format("YYYY-MM-DD")} -{" "}
          {moment(record.endDate).format("YYYY-MM-DD")}
        </>
      ),
    },
    {
      key: "3",
      title: "Internship Book Status",
      render: (record) => (
        <Space className="flex flex-wrap gap-4">
          <Button
            type="link"
            onClick={() => {
              setModalVisible(record._id);
            }}
          >
            <FileTextTwoTone style={{ fontSize: 25 }} />
          </Button>
          <span>{record.internshipBookStatus}</span>
        </Space>
      ),
    },

    {
      key: "4",
      title: "Internship Book",
      render: (record) => (
        <Space>
          {record.internshipBook ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadInternshipBook(record._id)}
            >
              Download
            </Button>
          ) : null}
        </Space>
      ),
    },
    {
      key: "5",
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
      key: "6",
      title: "Evaluation Form",
      render: (record) => (
        <Space>
          {record.evaluationForm?.contentType ? (
            <>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => downloadEvaluationForm(record._id)}
              >
                Download
              </Button>
              <Popconfirm
                title="Are you sure you want to delete the evaluation form?"
                onConfirm={() => deleteEvaluationForm(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Upload
              beforeUpload={(file) => uploadEvaluationForm(record._id, file)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          )}
        </Space>
      ),
    },
  ];


  const closeModal = () => {
    setModalVisible(false);
  };

  const handleApprove = async (id) => {
    const updatedDataSource = dataSource.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'APPROVED',
        };
      }
      return item;
    });
    setDataSource(updatedDataSource);
    setModalVisible(false);

    try {
      await axios.put(`http://localhost:5000/api/internships/${id}`, { newStatus: 'APPROVED' });
      console.log('Status updated successfully!');
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReject = async (id) => {
    const updatedDataSource = dataSource.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'REJECTED',
        };
      }
      return item;
    });
    setDataSource(updatedDataSource);
    setModalVisible(false);

    try {
      await axios.put(`http://localhost:5000/api/internships/${id}`, { newStatus: 'REJECTED' });
      console.log('Status updated successfully!');
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
    }
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



  const uploadEvaluationForm = async (internshipId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:5000/api/internships/${internshipId}/evaluationform`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        message.success("Evaluation form uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading evaluation form:", error);
      message.error("Failed to upload evaluation form");
    }
  };

  const deleteEvaluationForm = (internshipId) => {
    axios
      .delete(`http://localhost:5000/api/internships/${internshipId}/evaluationform`)
      .then(() => {
        setDataSource((prevDataSource) => {
          const updatedDataSource = prevDataSource.map((item) => {
            if (item._id === internshipId) {
              return { ...item, evaluationForm: null };
            }
            return item;
          });
          return updatedDataSource;
        });
        message.success("Evaluation form deleted successfully.");
      })
      .catch((error) => {
        console.error("Failed to delete evaluation form:", error);
        message.error("Failed to delete evaluation form. Please try again.");
      });
  };

  const fetchInternships = () => {
    axios
      .get(`http://localhost:5000/api/companies/${companyId}/internships`)
      .then((response) => {
        setDataSource(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
      });
  };

  useEffect(() => {
    fetchInternships();
  }, []);


  return (
    <>
      <CompanyNavbar />
      <div className="px-6 py-6 w-4/5 mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Approved Applications
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
        </Modal>
      </div>
    </>
  );
};

export default ApprovedApplication;
