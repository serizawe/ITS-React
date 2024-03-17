import { Button } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const HomePage2 = () => {
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
            <Link to={"/company/register"}>
              <Button className="w-full mb-6 bg-[#1b3365] text-white hover:text-[#9ad2ff]" size="large">
                Company Register
              </Button>
            </Link>
            <Link to={"/supervisor/register"}>
              <Button className="w-full mb-6 bg-[#1b3365] text-white hover:text-[#9ad2ff]" size="large">
                Internship Supervisor Register
              </Button>
            </Link>
            <Link to={"/student/register"}>
              <Button className="w-full mb-6 bg-[#1b3365] text-white hover:text-[#9ad2ff]" size="large">
                Student Register
              </Button>
            </Link>
            <div className="flex justify-center left-0  w-full">
              Do you have an account?&nbsp;
              <Link to="/" className="text-blue-600">
                Login Now!
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default HomePage2;
