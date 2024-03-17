import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const CompanyRegister = () => {
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
      const response = await axios.post('http://localhost:5000/api/companies', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      console.log(data); 
    } catch (error) {
      console.error(error);
    }
    navigate('/company/login');
  };


  if (!userType) {
    return (
      <div className="h-screen overflow-auto">
        <div className="flex justify-center vh-100">
          <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold mb-2 ">REGISTER</h1>
            <Form layout="vertical" onFinish={onFinish}>
              {/* Firma Adı */}
              <Form.Item
                label="Firm Name"
                name={"firmname"}
                rules={[
                  {
                    required: true,
                    message: "Firm Name must be required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* Lokasyon */}
              <Form.Item label="Location" name={"location"}>
                <Input />
              </Form.Item>
              {/* Telephone */}
              <Form.Item label="Contact Number" name={"contact"}>
                <Input />
              </Form.Item>
              {/* Sektör */}
              <Form.Item label="Sector" name={"sector"}>
                <Input />
              </Form.Item>
              {/* Personel Sayısı */}
              <Form.Item label="Work Areas" name={"workAreas"}>
                <Input />
              </Form.Item>
              {/* Username */}
              <Form.Item
                label="Number of Employee" name={"employeeNum"}>
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
              <Link to="/company/login" className="text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default CompanyRegister;
