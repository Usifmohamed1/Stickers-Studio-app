import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; 

function Header({ logoUrl, totalQty }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Show header only on home, cart, and form pages
  const showHeader = ["/", "/cart", "/form", "/admin"].includes(location.pathname);

  if (!showHeader) return null;

  // Show cart icon only on home and cart
  const showCartIcon = location.pathname === "/";

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2 relative">

        {showCartIcon && (
          <div className="hidden md:flex items-center mr-auto">
            <button
              onClick={() => navigate("/cart")}
              disabled={totalQty === 0}
              className={`relative p-2 rounded-full active:scale-95 focus:scale-95 ${
                totalQty > 0 ? "text-sky-500 hover:scale-110" : "text-gray-400 cursor-not-allowed"
              } transition-transform duration-200`}
            >
              <ShoppingCart size={28} />
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        )}

        {/* Logo (Left on mobile, Center on md+) */}
        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <button
            onClick={() => {
              if (location.pathname === "/") {
                navigate("/admin");
              }
            }}
            className={`flex items-center active:scale-95 focus:scale-95 transition-transform duration-200`}
            disabled={location.pathname !== "/"}
            style={location.pathname !== "/" ? { cursor: "not-allowed", opacity: 0.9 } : {}}
          >
            <img
              src={logoUrl}
              alt="logo"
              className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain active:scale-95 transition-transform"
            />
          </button>
        </div>

        {/* Social Media Links (Right side) */}
        <div className="flex space-x-3 ml-auto">
          <div className="flex flex-col items-center">
            <img
              src="https://i.postimg.cc/T3GJHtvk/insta.png"
              alt="Instagram QR"
              className="w-14 h-14 md:w-20 md:h-20 hover:scale-105 transition-transform duration-200"
            />
            <span className="text-[11px] md:text-sm text-gray-600">Instagram</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://i.postimg.cc/Ls8BmhXL/feb.png"
              alt="Facebook QR"
              className="w-14 h-14 md:w-20 md:h-20 hover:scale-105 transition-transform duration-200"
            />
            <span className="text-[11px] md:text-sm text-gray-600">Facebook</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
