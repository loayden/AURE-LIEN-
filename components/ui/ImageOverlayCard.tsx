"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ImageOverlayCardProps {
  title: string;
  image: string;
  link: string;
  index?: number;
}

export default function ImageOverlayCard({
  title,
  image,
  link,
  index = 0,
}: ImageOverlayCardProps) {
  return (
    <Link href={link} className="group block min-h-[44px] min-w-[44px]">
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="relative aspect-portrait-editorial overflow-hidden border border-ivory/10"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-6">
          <h3 className="text-xl font-serif font-light text-brass tracking-luxury-wide transition-colors duration-500 group-hover:text-brass-light sm:text-2xl md:text-3xl">
            {title}
          </h3>
          <span className="mt-3 block h-px w-10 bg-brass transition-all duration-500 group-hover:w-20 sm:mt-4 sm:w-12" />
        </div>
      </motion.div>
    </Link>
  );
}
