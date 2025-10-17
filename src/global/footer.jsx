import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/90 font-display">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold">
              Wonderful <span className="text-blue-400">Malang</span>
            </h3>
            <p className="text-white/70 text-sm">
              Jelajahi keindahan alam, budaya, dan kuliner.
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/discovery" className="hover:underline">
              Discovery
            </Link>
            <Link to="/adminlogin" className="hover:underline">
              Login
            </Link>
          </nav>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/60">
          © 2025 Wonderful Malang. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
