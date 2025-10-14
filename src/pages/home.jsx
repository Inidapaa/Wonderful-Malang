import Navbar from "../global/navbar.jsx";
import HoverUser from "../components/home/hoveruser.jsx";
import ImageOverlay from "../components/home/imageoverlay.jsx";
import Card from "../components/home/card.jsx";
import Footer from "../global/footer.jsx";

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="bg-[url('./assets/bglandingpage.jpg')] bg-cover bg-center h-full text-white w-[100%]">
        <div className="bg-gradient-to-b from-primary/50 to-primary">
          <div className="h-145 w-full px-20 flex flex-col font-display gap-30 pt-50">
            <div className="flex flex-col max-w-3xl gap-5">
              <h1 className="font-bold text-7xl">
                Pariwisata <br />
                <span className="text-blue-400">Malang Raya</span>
              </h1>
              <p>
                Jelajahi keindahan Malang Raya, surga wisata yang menyuguhkan
                panorama alam menakjubkan, kuliner khas yang menggugah selera,
                serta ragam destinasi unik untuk segala usia. Waktu terbaik
                untuk berpetualang dan menemukan keajaiban Jawa Timur dimulai di
                sini!
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <HoverUser />
          </div>
        </div>
      </section>
      <section className="bg-primary h-full w-full flex flex-col items-center justify-center font-display gap-30 py-20">
        <Card />
      </section>
      <section className="bg-primary h-full w-full flex flex-col items-center justify-center font-display gap-30 py-20">
        <h1 className="text-7xl text-white font-bold">Wisata Terbaru</h1>
        <div className="">
          <ImageOverlay />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
