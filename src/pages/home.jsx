import Navbar from "../global/navbar.jsx";
import HoverUser from "../components/home/hoveruser.jsx";
import ImageOverlay from "../components/home/imageoverlay.jsx";
import Card from "../components/home/card.jsx";
import Footer from "../global/footer.jsx";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  return (
    <>
      <Navbar />
      <section className="bg-[url('./assets/bglandingpage.jpg')] bg-cover bg-center h-full text-white w-[100%] overflow-y-scroll no-scrollbar">
        <div className="bg-gradient-to-b from-primary/50 to-primary">
          <div className="h-145 w-full px-6 md:px-20 flex flex-col font-display gap-8 md:gap-30 pt-16 md:pt-50">
            <div className="flex flex-col max-w-3xl gap-4 md:gap-5 text-center md:text-left">
              <h1 className="font-bold text-4xl md:text-7xl leading-tight md:leading-[1.1]">
                Pariwisata <br />
                <span className="text-blue-400">Malang Raya</span>
              </h1>
              <p className="text-base md:text-lg text-white/90">
                Jelajahi keindahan Malang Raya, surga wisata yang menyuguhkan
                panorama alam menakjubkan, kuliner khas yang menggugah selera,
                serta ragam destinasi unik untuk segala usia. Waktu terbaik
                untuk berpetualang dan menemukan keajaiban Jawa Timur dimulai di
                sini!
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center w-full px-6 md:px-0 z-10 pb-20">
            <HoverUser />
          </div>
        </div>
      </section>
      <section className="bg-primary h-full w-full flex flex-col items-center justify-center font-display gap-20 md:gap-30 py-16 md:py-20 px-6 md:px-0 overflow-y-scroll no-scrollbar">
        <Card />
      </section>
      <section className="bg-primary h-full w-full flex flex-col items-center justify-center font-display gap-10 md:gap-30 py-16 md:py-20 px-6 md:px-0 overflow-y-scroll no-scrollbar">
        <h1 className="text-3xl md:text-7xl text-white font-bold text-center">
          Wisata Terbaru
        </h1>
        <div className="w-full max-w-6xl">
          <ImageOverlay />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
