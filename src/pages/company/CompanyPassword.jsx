import { Button, Form, Input } from "antd";
import CompanyNavbar from "../../components/navbar/CompanyNavbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const CompanyPassword = () => {
  const companyId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { password, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/companies/${companyId}/change-password`,
        { companyId: companyId, currentPassword: password, newPassword: newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log(data); 
    } catch (error) {
      console.error(error);
    }
    navigate('/company/application')
  };


  return (
    <>
      <CompanyNavbar />
      <div className="h-screen overflow-auto ">
        <div className="flex justify-center items-center vh-100">
          <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold my-10">CHANGE PASSWORD</h1>
            <Form layout="vertical" onFinish={onFinish}>
              {/* Current Password */}
              <Form.Item
                label="Current Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              {/* New Password */}
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter a new password",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              {/* Confirm Password */}
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="mr-2"
                    size="large"
                  >
                    Update
                  </Button>
                  <Link to="/company">
                    <Button htmlType="button" size="large">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyPassword;
