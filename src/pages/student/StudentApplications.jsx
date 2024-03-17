import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import StudentNavbar from "../../components/navbar/StudentNavbar";

const StudentApplications = () => {
    const studentId = useSelector((state) => state.auth.userId);
    const [dataSource, setDataSource] = useState();

    const deleteApplication = (applicationId) => {
        console.log(applicationId);
        const updatedDataSource = dataSource.filter((item) => item._id !== applicationId);
        axios
            .delete(`http://localhost:5000/api/internship-applications/${applicationId}`)
            .then((response) => {
                console.log("Internship Application deleted successfully!");
                setDataSource(updatedDataSource);
            })
            .catch((error) => {
                console.error("Error deleting internship application:", error);
            });
    };


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${studentId}/applications`);
                setDataSource(response.data);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            }
        };

        fetchApplications();
    }, [studentId]);

    const columns = [
        {
            key: "1",
            title: "Company Name",
            dataIndex: ["announcement", "company", "companyName"],
        },
        {
            key: "2",
            title: "Internship Name",
            dataIndex: ["announcement", "internshipName"],
        },
        {
            key: "3",
            title: "Status",
            dataIndex: "status",
        },
        {
            key: "4",
            title: "Action",
            render: (record) => (
                <Popconfirm
                    title="Are you sure you want to delete this application?"
                    onConfirm={() => deleteApplication(record._id)} 
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger" icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
        {
            key: "5",
            title: "Created Date",
            dataIndex: "createdAt",
            render: (date) => moment(date).format("YYYY-MM-DD"), 
        },
    ];

    return (
        <>
            <StudentNavbar />
            <div className="px-6 py-6 w-4/5 mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">My Applications</h1>
                <Table dataSource={dataSource} columns={columns} />
            </div>
        </>
    );
};

export default StudentApplications;
