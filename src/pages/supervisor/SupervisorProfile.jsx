import { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import SupervisorNavbar from "../../components/navbar/SupervisorNavbar";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const SupervisorProfile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const supervisorId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supervisors/${supervisorId}`);
        const { _id, ...userDataWithoutId } = response.data;
        setUserData(userDataWithoutId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [supervisorId]);

  const onFinish = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/supervisors/${supervisorId}`, {
        ...userData,
        ...values
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    navigate('/supervisor/applications')
  };

  console.log(userData);

  return (
    <>
      <SupervisorNavbar />
      <div className="h-screen overflow-auto">
        <div className="flex justify-center vh-100">
          <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold mb-2 ">PROFILE</h1>
            {Object.keys(userData).length > 0 && ( // Render form only when userData is populated
              <Form layout="vertical" onFinish={onFinish} initialValues={userData}>
                <Form.Item
                  label="Name"
                  name="name"
                  initialValue={userData.name}
                  rules={[
                    {
                      required: true,
                      message: "Name is required!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Surname"
                  name="surname"
                  initialValue={userData.surname}
                  rules={[
                    {
                      required: true,
                      message: "Surname is required!",
                    },
                  ]}
                >
                  <Input />
                  {console.log(userData.surname)}
                </Form.Item>

                <Form.Item
                  label="Department"
                  name="departmentName"
                  initialValue={userData.departmentName}
                  rules={[
                    {
                      required: true,
                      message: "Department is required!",
                    },
                  ]}
                >
                  <Select defaultValue={userData.departmentName}>
                    {console.log(userData.departmentName)}
                    <Option value="department1">Department 1</Option>
                    <Option value="department2">Department 2</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  initialValue={userData.email}
                  rules={[
                    {
                      required: true,
                      message: "Email is required!",
                    },
                  ]}
                >
                  <Input />
                  {console.log(userData.email)}
                </Form.Item>

                <Form.Item>
                  <div className="flex justify-end mb-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="mr-2"
                      size="large"
                    >
                      Update
                    </Button>
                    <Button htmlType="button" size="large">
                      Cancel
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupervisorProfile;
