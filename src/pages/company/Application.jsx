import CompanyNavbar from "../../components/navbar/CompanyNavbar";
import { Table, Modal, Button, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, EyeOutlined, CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";


const Application = () => {
  const companyId = localStorage.getItem('userId');
  const [announcementId, setAnnouncementId] = useState(null);
  const [tooltipData, setTooltipData] = useState([]);
  const [dataSource, setDataSource] = useState([

  ]);
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const renderTooltipContent = (record) => {
    const student = tooltipData.find((item) => item.id === record.id);
    console.log(student);
    if (student) {
      return (
        <div>
          {Object.entries(student).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };



  const columns = [
    {
      key: "1",
      title: "Full Name",
      dataIndex: "internshipName",
    },
    {
      key: "2",
      title: "Number of Applications",
      render: (record) => <span>{record.applications.length}</span>,
    },
    {
      key: "3",
      title: "View",
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            setAnnouncementId(record.key);
            setModalVisible(true);
          }}
        >
          <EyeOutlined style={{ color: "blue", fontSize: 20 }} />
        </Button>
      ),
    },
    {
      key: "4",
      title: "Delete",
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            onDeleteAnnouncement(record);
          }}
        >
          <DeleteOutlined style={{ color: "red", fontSize: 20 }} />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`http://localhost:5000/api/internship-announcements/${companyId}`)
        .then((response) => {
          const announcements = response.data.map((announcement) => ({
            ...announcement,
            key: announcement._id, 
          }));
          setDataSource(announcements);
        })
        .catch((error) => {
          console.error("Error fetching internship announcements:", error);
        });
    };
    fetchData(); 

    const interval = setInterval(fetchData, 10000); 

    return () => {
      clearInterval(interval); 
    };
  }, []);
  useEffect(() => {
    if (announcementId) {
      console.log(announcementId);
      axios
        .get(`http://localhost:5000/api/internship-announcements/${announcementId}/applications`)
        .then((response) => {
          const applications = response.data;
          console.log(response.data);
          setTableData(
            applications.map((application) => ({
              key: application._id,
              name: application.student.name,
              surname: application.student.surname,
              approve: (
                <Button
                  onClick={() => {
                    onApproveApplication(application);
                  }}
                  type="link"
                >
                  <CheckSquareFilled style={{ color: "green", fontSize: 35 }} />
                </Button>
              ),
              reject: (
                <Button
                  type="link"
                  onClick={() => {
                    onRejectApplication(application);
                  }}
                >
                  <CloseSquareFilled style={{ color: "red", fontSize: 35 }} />
                </Button>
              ),
            }))
          );
          setTooltipData(
            applications.map((application) => ({
              gpa: application.student.gpa,
              classYear: application.student.classYear,
              departmentName: application.student.departmentName,
              email: application.student.email,
              phone: application.student.phone,
              address: application.student.address,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);
        });
    }
  }, [announcementId]);




  const onDeleteAnnouncement = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this announcement?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios
          .delete(`http://localhost:5000/api/internship-announcements/${record._id}`)
          .then((response) => {
            console.log("Announcement deleted successfully!");
            setDataSource((prev) =>
              prev.filter((announcement) => announcement._id !== record._id)
            );
          })
          .catch((error) => {
            console.error("Error deleting announcement:", error);
          });
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const tableColumns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Tooltip title={renderTooltipContent(record)}>
          <span>{`${record.name} ${record.surname}`}</span>
        </Tooltip>
      ),
    },
    {
      key: "approve",
      title: "Approve",
      dataIndex: "approve",
      render: (text, record) => (
        <Button
          onClick={() => onApproveApplication(record)}
          type="link"
        >
          <CheckSquareFilled style={{ color: "green", fontSize: 35 }} />
        </Button>
      ),
    },
    {
      key: "reject",
      title: "Reject",
      dataIndex: "reject",
      render: (text, record) => (
        <Button
          onClick={() => onRejectApplication(record)}
          type="link"
        >
          <CloseSquareFilled style={{ color: "red", fontSize: 35 }} />
        </Button>
      ),
    },
  ];




  const onApproveApplication = (record) => {
    Modal.confirm({
      title: "Are you sure you want to approve this application?",
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        axios
          .patch(`http://localhost:5000/api/internship-applications/${record.key}`, { status: "Waiting for supervisor approval" }) 
          .then((response) => {
            console.log("Application approved successfully!");
            setTableData((prev) =>
              prev.filter((application) => application.key !== record.key)
            );
            const successModal = Modal.success({
              content: "The application has been approved.",
              footer: null, 
            });

            setTimeout(() => {
              successModal.destroy();
            }, 2000); 
          })
          .catch((error) => {
            console.log(record.key)
            console.error("Error approving application:", error);
          });
      },
    });
  };


  const onRejectApplication = (record) => {
    Modal.confirm({
      title: "Are you sure you want to reject this application?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios
          .patch(`http://localhost:5000/api/internship-applications/${record.key}`, { status: "Rejected" })
          .then((response) => {
            console.log("Application rejected successfully!");
            setTableData((prev) =>
              prev.filter((application) => application.key !== record.key)
            );
          })
          .catch((error) => {
            console.error("Error rejecting application:", error);
          });
      },
    });
  };



  return (
    <>
      <CompanyNavbar />
      <div className="px-6 py-6 w-4/5 mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Internship Applications
        </h1>
        <Table columns={columns} dataSource={dataSource} />

        <Modal
          title={<div className="text-center">Student Information</div>}
          visible={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <Table columns={tableColumns} dataSource={tableData} />
        </Modal>
      </div>
    </>
  );
};

export default Application;

