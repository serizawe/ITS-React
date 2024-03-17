import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table, Button, Space, Upload, message, Popconfirm } from "antd";
import { DownloadOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import StudentNavbar from "../../components/navbar/StudentNavbar";
import { saveAs } from "file-saver";
import moment from 'moment';

const StudentInternships = () => {
    const studentId = useSelector((state) => state.auth.userId);
    const [dataSource, setDataSource] = useState();

    const columns = [
        {
            key: "1",
            title: "Company",
            dataIndex: "company",
            render: (company) => company.companyName,
        },
        {
            key: "2",
            title: "Start Date",
            dataIndex: "startDate",
            render: (startDate) => moment(startDate).format("YYYY-MM-DD"),
        },
        {
            key: "3",
            title: "End Date",
            dataIndex: "endDate",
            render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
        },
        {
            key: "4",
            title: "Internship Book",
            render: (record) => (
                <Space>
                    {record.internshipBook && record.internshipBook.contentType ? (
                        <>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => downloadInternshipBook(record.id)}
                            >
                                Download
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the internship book?"
                                onConfirm={() => deleteInternshipBook(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="danger" icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <Upload beforeUpload={(file) => uploadInternshipBook(record.id, file)}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    )}
                </Space>
            ),
        },
        {
            key: "5",
            title: "Internship Book Status",
            dataIndex: "bookStatus",
        },
        {
            key: "6",
            title: "Book Comment",
            dataIndex: "bookComment",
        },
        {
            key: "7",
            title: "Internship Status",
            dataIndex: "status",
        },
    ];

    const downloadInternshipBook = (internshipId) => {
        axios({
            url: `http://localhost:5000/api/internships/${internshipId}/internshipbook`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                const filename = getFilenameFromResponse(response);
                const blob = new Blob([response.data], { type: "application/pdf" });
                saveAs(blob, filename);
            })
            .catch((error) => {
                console.error("Error downloading internship book:", error);
                message.error("Failed to download internship book");
            });
    };

    const getFilenameFromResponse = (response) => {
        const contentDispositionHeader = response.headers["content-disposition"];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, "");
        }
        return "internship-book.pdf";
    };

    const uploadInternshipBook = async (internshipId, file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `http://localhost:5000/api/internships/${internshipId}/internshipbook`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                message.success("Internship book uploaded successfully");
            }
        } catch (error) {
            console.error("Error uploading internship book:", error);
            message.error("Failed to upload internship book");
        }
    };




    const deleteInternshipBook = (internshipId) => {
        axios
            .delete(`http://localhost:5000/api/internships/${internshipId}/internshipbook`)
            .then(() => {
                setDataSource((prevDataSource) => {
                    const updatedDataSource = prevDataSource.map((item) => {
                        if (item.id === internshipId) {
                            return { ...item, internshipBook: "" };
                        }
                        return item;
                    });
                    return updatedDataSource;
                });
                message.success("Internship book deleted successfully.");
            })
            .catch((error) => {
                console.error("Failed to delete internship book:", error);
                message.error("Failed to delete internship book. Please try again.");
            });
    };


    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${studentId}/internships`);
                setDataSource(response.data);
            } catch (error) {
                console.error("Failed to fetch internships:", error);
            }
        };

        fetchInternships();
    }, [studentId]);
    return (
        <>
            <StudentNavbar />
            <div className="px-6 py-6 w-4/5 mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">My Internships</h1>
                <Table dataSource={dataSource} columns={columns} />
            </div>
        </>
    );
};

export default StudentInternships;
