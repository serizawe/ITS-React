import { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import CompanyNavbar from "../../components/navbar/CompanyNavbar";
import { useNavigate } from "react-router-dom";


const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const companyId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/companies/${companyId}`)
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching company data:', error);
      });


  }, [companyId]);

  const onFinish = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/companies/${companyId}`, {
        ...companyData,
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
    navigate('/company/application')
  };

  if (!companyData) return "Loading...";

  return (
    <>
      <CompanyNavbar />
      <div className="h-screen overflow-auto">
        <div className="flex justify-center vh-100">
          <div className="xl:px-20 px-10 py-10 w-1/2 flex flex-col h-full justify-center relative">
            <h1 className="text-center text-5xl font-bold mb-2 ">PROFILE</h1>
            <Form layout="vertical" onFinish={onFinish} initialValues={companyData}>
              {/* Firma Adı */}
              <Form.Item
                label="Firm Name"
                name="companyName"
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
              <Form.Item label="Location" name="location">
                <Input />
              </Form.Item>
              {/* Telephone */}
              <Form.Item label="Contact Number" name="contactNumber">
                <Input />
              </Form.Item>
              {/* Sektör */}
              <Form.Item label="Sector" name="sector">
                <Input />
              </Form.Item>
              {/* Çalışma Alanları */}
              <Form.Item label="Work Areas" name="workAreas">
                <Input />
              </Form.Item>
              {/* Personel Sayısı */}
              <Form.Item label="Number of Employees" name="numberOfEmployees">
                <Input />
              </Form.Item>
              {/* E-mail */}
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "E-mail must be required!",
                  },
                ]}
              >
                <Input />
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
          </div>
        </div>
      </div>
    </>

  );
};

export default CompanyProfile;
