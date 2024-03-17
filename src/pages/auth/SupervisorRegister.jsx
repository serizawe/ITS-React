import { Button, Checkbox, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const { Option } = Select;
const SupervisorRegister = () => {
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
      const response = await axios.post('http://localhost:5000/api/supervisors/register', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      console.log(data); // you can do something with the response data
    } catch (error) {
      console.error(error);
    }
    navigate('/supervisor/login');
  };

  if (!userType) {
    return (
      <div className="h-screen overflow-auto">
        <div className="flex justify-center vh-100">
          <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold mb-2 ">REGISTER</h1>
            <Form layout="vertical" onFinish={onFinish}>
              {/* Akademisyenin Adı */}
              <Form.Item
                label="Name"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Name must be required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* Soyisim */}
              <Form.Item label="Surname"
                name={"surname"}
                rules={[
                  {
                    required: true,
                    message: "Surname must be required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* E-mail */}
              <Form.Item
                label="E-mail"
                name={"email"}
                rules={[
                  {
                    required: true,
                    message: "E-mail must be required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
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
              {/* Password */}
              <Form.Item
                label="Password"
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Password must be required!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name={"remember"} valuePropName="checked">
                <div className="flex justify-between items-center">
                  <Checkbox>Remember me</Checkbox>
                  <Link>Forgot Password?</Link>
                </div>
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
              <Link to="/supervisor/login" className="text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default SupervisorRegister;