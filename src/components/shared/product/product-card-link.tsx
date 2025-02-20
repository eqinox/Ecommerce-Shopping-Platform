"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import loader from "@/assets/loader.gif";

interface ProductCardLinkProps {
  slug: string;
  imageSrc: string;
}

const ProductCardLink: React.FC<ProductCardLinkProps> = ({
  slug,
  imageSrc,
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Link
      href={`/product/${slug}`}
      onClick={() => startTransition(() => {})}
      className="relative"
    >
      <>
        <Image
          src={imageSrc}
          alt="Product Image"
          height={300}
          width={300}
          priority
        />
        {isPending && (
          <Image
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-75"
            src={loader}
            height={100}
            width={100}
            alt="Loading..."
          />
        )}
      </>
    </Link>
  );
};

export default ProductCardLink;
