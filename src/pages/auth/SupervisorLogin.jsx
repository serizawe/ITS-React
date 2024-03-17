import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { supervisorLogin } from '../../redux/authSlice';


const SupervisorLogin = () => {
  const dispatch = useDispatch();
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



  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData; 

  const handleSubmit = () => {

    dispatch(supervisorLogin(email, password)).then(() => {
      navigate('/supervisor/applications');
    });
  };

  if (!userType) {
    return (
      <div className="h-screen ">
        <div className=" h-full flex justify-center">
          <div className="xl:px-40 px-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold mb-2">LOGIN</h1>
            <Form layout="vertical" onFinish={handleSubmit}>
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
                <Input onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </Form.Item>
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
                <Input.Password onChange={e => setFormData({ ...formData, password: e.target.value })} />
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
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div className="flex justify-center left-0  w-full">
              Don't have an account?&nbsp;
              <Link to="/supervisor/register" className="text-blue-600">
                Register Now!
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default SupervisorLogin;