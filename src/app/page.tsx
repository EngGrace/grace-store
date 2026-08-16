"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const carouselItems = [
  { id: "6a1352a162a6351b5d1a1252", name: "iPhone 17 Pro", phrase: "All out Pro.", tag: "New", image: "/productspng/iphone-17-pro.jpg", bgColor: "#000000", textColor: "#ffffff", imageClass: "image-large" },
  { id: "6a13541f62a6351b5d1a1254", name: "Samsung Galaxy S26", phrase: "The new standard of Galaxy.", tag: "New", image: "/productspng/samsung-S26-Ultra.jpg", bgColor: "#ffffff" },
  { id: "6a13547162a6351b5d1a1255", name: "MacBook Neo", phrase: "The magic of Mac at a surprising price.", tag: "New", image: "/productspng/macbook-neo.jpg", bgColor: "#F5F5F7", imageClass: "image-large" },
  { id: "6a7f0af341315d299586b3a3", name: "Skull Candy Crusher", phrase: "Immersive bass you can feel.", tag: "Trending", image: "/productspng/crusher-anc-2.webp", bgColor: "#ffffff", },
  { id: "6a7f0d6d41315d299586b3a4", name: "MacBook Pro", phrase: "Fast runs in the family!", tag: "Popular", image: "/productspng/macbook-pro.jpg", bgColor: "#000000", textColor: "#ffffff", },
  { id: "6a7f0df241315d299586b3a5", name: "Garmin Watch", phrase: "Push your limits.", tag: "New", image: "/productspng/forerunner-165.avif", bgColor: "#ffffff", },
];

export default function Home() {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scrollByAmount = (amount: number) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Technology. Simplified.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our extremely premium selection of the highest tier electronics and minimalist accessories, curated just for you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link href="/products" className="btn-primary" style={{ fontSize: '18px', padding: '16px 36px' }}>
            Shop Our Collection <ShoppingBag size={20} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }} />
          </Link>
        </motion.div>
      </section>

      <motion.div
        className="carousel-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {showLeftArrow && (
          <button className="carousel-arrow left" onClick={() => scrollByAmount(-400)} aria-label="Scroll left">
            <ChevronLeft size={28} />
          </button>
        )}

        <div
          className="carousel-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {carouselItems.map((item) => (
            <Link
              href={`/products/${item.id}`}
              key={item.id}
              className="carousel-item"
              style={{ backgroundColor: item.bgColor }}
            >
              <span className="carousel-item-tag">{item.tag}</span>
              <h3 style={{ color: item.textColor }}>{item.name}</h3>
              <p style={{ color: item.textColor }}>{item.phrase}</p>
              <div className={`carousel-item-image ${item.imageClass || ""}`}>
                < Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button className="carousel-arrow right" onClick={() => scrollByAmount(400)} aria-label="Scroll right">
            <ChevronRight size={28} />
          </button>
        )}
      </motion.div>
    </div>
  );
}
