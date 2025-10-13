import LoginCard from "../components/admin/logincard";

const Login = () => {
  return (
    <>
      <div className="font-display bg-[url('./assets/bglandingpage.jpg')] h-screen w-full bg-cover bg-center">
        <div className="backdrop-blur-[5px] w-full h-screen flex justify-center items-center bg-gradient-to-b from-primary/20 to-primary/80">
          <LoginCard />
        </div>
      </div>
    </>
  );
};

export default Login;
