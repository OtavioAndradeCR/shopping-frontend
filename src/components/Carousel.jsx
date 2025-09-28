import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { id: 1, image: import.meta.env.BASE_URL + 'carousel-promo-1.png', title: 'Mega Promoção Eletrônicos', subtitle: '50% OFF em produtos selecionados', link: '#electronics' },
  { id: 2, image: import.meta.env.BASE_URL + 'carousel-promo-2.png', title: 'Nova Coleção Fashion', subtitle: 'Frete grátis para todo o Brasil', link: '#fashion' },
  { id: 3, image: import.meta.env.BASE_URL + 'carousel-promo-3.png', title: 'Beleza & Cuidados', subtitle: 'Novidades em cosméticos', link: '#beauty' }
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const count = slides.length;

  // autoplay
  useEffect(() => {
    const id = setInterval(() => setCurrentSlide(s => (s + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  const prevSlide = () => setCurrentSlide(s => (s - 1 + count) % count);
  const nextSlide = () => setCurrentSlide(s => (s + 1) % count);
  const goToSlide = (i) => setCurrentSlide(i);

  // layout calculations
  const wrapperWidth = `${count * 100}%`;                 
  const translatePercent = (100 / count) * currentSlide;

  return (
    <div className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden rounded-lg shadow-lg mb-8">
      {/* wrapper: largura total = numSlides * 100% */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: wrapperWidth,
          transform: `translateX(-${translatePercent}%)`
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="h-full flex-shrink-0 relative"
            style={{ width: `${100 / count}%` }}
            onClick={() => console.log('Navegar para:', slide.link)}
            role="button"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                <p className="text-lg md:text-xl drop-shadow-lg">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* botões */}
      <button onClick={prevSlide} aria-label="Anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button onClick={nextSlide} aria-label="Próximo" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg">
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${i === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
          />
        ))}
      </div>
    </div>
  );
}
