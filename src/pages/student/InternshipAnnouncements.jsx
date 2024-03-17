import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import StudentNavbar from "../../components/navbar/StudentNavbar";
import moment from "moment";

const InternshipAnnouncements = () => {
    const studentId = useSelector((state) => state.auth.userId);
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [appliedAnnouncements, setAppliedAnnouncements] = useState(new Set());

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/internship-announcements");
                setDataSource(response.data);
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleApplication = (record) => {
        setSelectedAnnouncement(record);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedAnnouncement(null);
    };

    const handleApply = () => {
        if (selectedAnnouncement) {
            const applicationData = {
                studentId,
                announcementId: selectedAnnouncement._id,
            };
            axios.post("http://localhost:5000/api/internship-applications/apply", applicationData)
                .then((response) => {
                    setAppliedAnnouncements((prevSet) => new Set(prevSet.add(selectedAnnouncement._id)));
                    closeModal();
                })
                .catch((error) => {
                    console.error("Failed to submit application:", error);
                });
        }
    };

    const columns = [
        {
            key: "1",
            title: "Company",
            dataIndex: "company",
            render: (company) => company ? company.companyName : "",
        },
        {
            key: "2",
            title: "Sector",
            dataIndex: "company",
            render: (company) => company ? company.sector : "",
        },
        {
            key: "3",
            title: "Location",
            dataIndex: "company",
            render: (company) => company ? company.location : "",
        },
        {
            key: "5",
            title: "Internship Name",
            dataIndex: "internshipName",
        },
        {
            key: "6",
            title: "Internship Type",
            dataIndex: "internshipType",
        },
        {
            key: "7",
            title: "Internship Program",
            dataIndex: "internshipProgram",
        },
        {
            key: "8",
            title: "Insurance Situation",
            dataIndex: "insuranceSituation",
        },
        {
            key: "9",
            title: "Date Range",
            render: (record) => (
                <div style={{ whiteSpace: "nowrap" }}>
                    {moment(record.dateRange1).format("YYYY-MM-DD")} - {moment(record.dateRange2).format("YYYY-MM-DD")}
                </div>
            ),
        },
        {
            key: "10",
            title: "Department Names",
            dataIndex: "departmentNames",
        },
        {
            key: "11",
            title: "Student Department Names",
            dataIndex: "studentDepartmentNames",
        },
        {
            key: "apply",
            title: "Action",
            render: (record) => (
                appliedAnnouncements.has(record._id) ? (
                    <Button type="primary" disabled>
                        Applied
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => handleApplication(record)}>
                        Apply
                    </Button>
                )
            ),
        },
    ];

    return (
        <>
            <StudentNavbar />
            <div className="px-6 py-6 w-4/5 mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">Internship Announcements</h1>
                <Table dataSource={dataSource} columns={columns} />
                <Modal
                    title="Application Form"
                    visible={modalVisible}
                    onCancel={closeModal}
                    footer={[
                        <Button key="cancel" onClick={closeModal}>
                            Cancel
                        </Button>,
                        <Button key="apply" type="primary" onClick={handleApply}>
                            Apply
                        </Button>,
                    ]}
                >
                </Modal>
            </div>
        </>
    );
};

export default InternshipAnnouncements;
