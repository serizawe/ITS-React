import { Button } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {

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


  if (!userType) {
    return (
      <div className="h-screen">
        <div className=" h-full flex justify-center">
          <div className="xl:px-40 px-10 w-1/2 flex flex-col h-full justify-center">
            <h1 className="text-center text-5xl font-bold mb-8">WELCOME</h1>
            <Link to={"/company/login"}>
              <Button type="primary" className="w-full mb-6" size="large">
                Company Login
              </Button>
            </Link>
            <Link to={"/supervisor/login"}>
              <Button type="primary" className="w-full mb-6" size="large">
                Internship Supervisor Login
              </Button>
            </Link>
            <Link to={"/student/login"}>
              <Button type="primary" className="w-full mb-6" size="large">
                Student Login
              </Button>
            </Link>
            <div className="flex justify-center left-0  w-full">
              Don't have an account?&nbsp;
              <Link to="/register" className="text-blue-600">
                Register Now!
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default HomePage;
