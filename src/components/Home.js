import { ShoppingCart } from "lucide-react";

function CategoryCard({ title, onClick, img }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl shadow-2xl aspect-[12.7/16] text-left active:scale-95 transition-transform"
    >
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
      <div className="absolute bottom-3 left-3 text-white">
        <div className="text-xl font-bold">{title}</div>
      </div>
    </button>
  );
}

function Home({ gotoCategory, onGoCart, totalQty }) {
  return (
    <section>
      <div className="flex flex-row items-center justify-between md:justify-center mb-4 w-full">
        <p className="tracking-wide text-[22px] md:text-[50px] font-bold whitespace-nowrap text-sky-400 font-Chewy md:[text-shadow:_1px_5px_0_#000,_2px_1px_0_#000] [text-shadow:_1px_3px_0_#000,_2px_1px_0_#000] active:scale-95 transition-transform">
          Choose a Category
        </p>

        {totalQty > 0 && (
          <button
            onClick={onGoCart}
            className="relative p-2 rounded-full block md:hidden active:scale-95 focus:scale-95 text-sky-500 hover:scale-110 transition-transform duration-200"
            aria-label="Go to Cart"
          >
            <ShoppingCart size={28} />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 mb-10 mt-5 active:scale-95 transition-transform">
        <CategoryCard
          onClick={() => gotoCategory("stickers")}
          img="https://i.postimg.cc/bNW9QV3n/stickers.png"
        />
        <CategoryCard
          onClick={() => gotoCategory("posters")}
          img="https://i.postimg.cc/nVYLKX2G/pos-358-x-452-px.png"
        />
      </div>
    </section>
  );
}

export default Home;
