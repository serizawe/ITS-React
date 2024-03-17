import { Button, Checkbox, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const { Option } = Select;

const StudentRegister = () => {

    const navigate = useNavigate();
    const userType = useSelector((state) => state.auth.userType);

    useEffect(() => {
        if (userType === "Student") {
            navigate("/student/applications");
        } else if (userType === "Supervisor") {
            navigate("/supervisor/applications");
        } else if (userType === "Company") {
            navigate("/company/application");
        }
    }, [navigate, userType]);
    const onFinish = async (values) => {
        try {
            console.log(values);
            const response = await axios.post('http://localhost:5000/api/students', values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        navigate('/student/login')
    };
    if (!userType) {
        return (
            <div className="h-screen overflow-auto">
                <div className="flex justify-center vh-100">
                    <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
                        <h1 className="text-center text-5xl font-bold mb-2">REGISTER</h1>
                        <Form layout="vertical" onFinish={onFinish}>
                            {/* Student Number */}
                            <Form.Item
                                label="Student Number"
                                name="studentNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: "Student number is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Name */}
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Name is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Surname */}
                            <Form.Item
                                label="Surname"
                                name="surname"
                                rules={[
                                    {
                                        required: true,
                                        message: "Surname is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Class Year */}
                            <Form.Item
                                label="Class Year"
                                name="classYear"
                                rules={[
                                    {
                                        required: true,
                                        message: "Class year is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* GPA */}
                            <Form.Item
                                label="GPA"
                                name="gpa"
                                rules={[
                                    {
                                        required: true,
                                        message: "GPA is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Email */}
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Email is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Phone */}
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Phone is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Address */}
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Address is required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Password */}
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is required!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            {/* Department */}
                            <Form.Item
                                label="Department"
                                name="departmentName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Department is required!",
                                    },
                                ]}
                            >
                                <Select>
                                    <Option value="department1">Department 1</Option>
                                    <Option value="department2">Department 2</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full"
                                    size="large"
                                >
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className="flex justify-center left-0 w-full">
                            Do you have an account?&nbsp;
                            <Link to="/student/login" className="text-blue-600">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default StudentRegister;

