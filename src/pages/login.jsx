import LoginCard from "../components/admin/logincard";
import Footer from "../global/footer.jsx";

const Login = () => {
  return (
    <>
      <div className="font-display bg-[url('./assets/bglandingpage.jpg')] h-full w-full bg-cover bg-center">
        <div className="backdrop-blur-[5px] w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-primary/20 to-primary/80 px-6 md:px-0">
          <LoginCard />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
