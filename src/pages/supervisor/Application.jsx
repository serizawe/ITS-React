import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SupervisorNavbar from "../../components/navbar/SupervisorNavbar";
import { Table, Modal, Button, Space, message, Input } from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
} from "@ant-design/icons";
import moment from "moment";

const InternshipApplications = () => {
    const supervisorId = useSelector((state) => state.auth.userId);
    const [dataSource, setDataSource] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const fetchApplications = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/supervisors/${supervisorId}/pending-applications`
            );

            const updatedDataSource = response.data.map((application) => {
                return {
                    key: application.id,
                    id: application.id,
                    name: application.name,
                    surname: application.surname,
                    gpa: application.gpa,
                    classYear: application.classYear,
                    departmentName: application.departmentName,
                    email: application.email,
                    phone: application.phone,
                    address: application.address,
                    status: application.status,
                    companyName: application.companyName,
                    sector: application.sector,
                    location: application.location,
                    employeeNum: application.employeeNum,
                    contactNumber: application.contactNumber,
                    internshipName: application.internshipName,
                    internshipType: application.internshipType,
                    internshipProgram: application.internshipProgram,
                    insuranceSituation: application.insuranceSituation,
                    dateRange1: application.dateRange1,
                    dateRange2: application.dateRange2,
                    departmentNames: application.departmentNames,
                    studentDepartmentNames: application.studentDepartmentNames,
                };
            });

            setDataSource(updatedDataSource);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [supervisorId]);




    const handleApproval = (record) => {
        const updatedDataSource = dataSource.map((item) => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: "Approved",
                };
            }
            return item;
        });
        setDataSource(updatedDataSource);
        axios
            .patch(`http://localhost:5000/api/internship-applications/${record.id}`, {
                status: "Approved",
            })
            .then((response) => {
                message.success("Application approved successfully");
                axios
                    .post(`http://localhost:5000/api/internships/create/${record.id}`)
                    .then((response) => {
                        message.success("Internship created successfully");
                    })
                    .catch((error) => {
                        console.error("Failed to create internship:", error);
                        message.error("Failed to create internship. Please try again.");
                    });
            })
            .catch((error) => {
                console.log(record.id);
                console.error("Failed to approve application:", error);
                message.error("Failed to approve application. Please try again.");
            });
    };

    const handleRejection = (record) => {
        setSelectedApplication(record);
        setModalVisible(true);
    };

    const handleConfirmRejection = () => {
        if (!rejectionReason) {
            message.warning("Please enter a rejection reason.");
            return;
        }
        const updatedDataSource = dataSource.map((item) => {
            if (item.id === selectedApplication.id) {
                return {
                    ...item,
                    status: "Rejected",
                    rejectionReason: rejectionReason
                };
            }
            return item;
        });
        setDataSource(updatedDataSource);
        setModalVisible(false);
        setRejectionReason("");
        axios
            .patch(`http://localhost:5000/api/applications/${selectedApplication.id}`, {
                status: "Rejected",
                rejectionReason: rejectionReason
            })
            .then((response) => {
                message.success("Application rejected successfully");
            })
            .catch((error) => {
                console.error("Failed to reject application:", error);
                message.error("Failed to reject application. Please try again.");
            });
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            key: "department",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            key: "action",
            render: (record) => {
                return record.status === "Waiting for supervisor approval" ? (
                    <Space size="middle">
                        <Button type="primary" onClick={() => handleApproval(record)}>Approve</Button>
                        <Button type="danger" onClick={() => handleRejection(record)}>Reject</Button>
                    </Space>
                ) : record.status === "Approved" ? (
                    <CheckCircleFilled style={{ color: "green", fontSize: 18 }} />
                ) : (
                    <div>
                        <CloseCircleFilled style={{ color: "red", fontSize: 18 }} />
                        <span>Rejected: {record.rejectionReason}</span>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <SupervisorNavbar />
            <div className="px-6 py-6 w-4/5 mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">Internship Applications</h1>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div style={{ margin: 0 }}>
                                <p>Company: {record.companyName}</p>
                                <p>Sector: {record.sector}</p>
                                <p>Location: {record.location}</p>
                                <p>Number of Employees: {record.employeeNum}</p>
                                <p>Contact Number: {record.contactNumber}</p>
                                <p>Internship Name: {record.internshipName}</p>
                                <p>Internship Type: {record.internshipType}</p>
                                <p>Internship Program: {record.internshipProgram}</p>
                                <p>Insurance Situation: {record.insuranceSituation}</p>
                                <p>Date Range: {moment(record.dateRange1).format('YYYY-MM-DD')} - {moment(record.dateRange2).format('YYYY-MM-DD')}</p>
                                <p>Department Names: {record.departmentNames}</p>
                                <p>Student Department Names: {record.studentDepartmentNames}</p>
                            </div>
                        ),
                        expandRowByClick: true,
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                if (event.target.tagName === "TD") {
                                    this.refs.table.toggleExpand(rowIndex);
                                }
                            },
                        };
                    }}
                />
                <Modal
                    title="Confirm Rejection"
                    visible={modalVisible}
                    onOk={handleConfirmRejection}
                    onCancel={() => {
                        setModalVisible(false);
                        setRejectionReason("");
                    }}
                    okButtonProps={{ danger: true, loading: false }}
                >
                    <p>Are you sure you want to reject this application?</p>
                    <Input
                        placeholder="Enter rejection reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </Modal>
            </div>
        </>
    );

};

export default InternshipApplications;