import { Outlet } from "react-router-dom";
import ModifiedNavbar from "./Common/ModifiedNavbar";
import Chatbot from "./Common/Chatbot";

const Root = () => {
  // const location = useLocation();
  // console.log(location);
  // const homePage = location.pathname.includes('home');
  // const loginPage = location.pathname.includes('login');
  return (
    <div className="bg-[#000000] min-h-screen">
      <div className="px-20">
        <ModifiedNavbar></ModifiedNavbar>
        <Outlet></Outlet>
      <Chatbot></Chatbot>
    </div>
    </div>
  );
};

export default Root;
