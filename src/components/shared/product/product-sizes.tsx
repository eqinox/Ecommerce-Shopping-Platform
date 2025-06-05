import { Badge } from "@/components/ui/badge";
import { AllSizes, Product } from "@/types";

interface ProductSize {
  product: Product;
  selectedSize: string;
  onSizeSelect: (size: AllSizes) => void;
}

const sizeOrder: AllSizes[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const ProductSizes: React.FC<ProductSize> = ({
  product,
  onSizeSelect,
  selectedSize,
}) => {
  const selectedSizeQuantity = product.sizes.find(
    (s) => s.size === selectedSize
  )?.quantity;

  const sortedSizes = [...product.sizes].sort(
    (a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
  );

  return (
    <div className="mt-10">
      <h2 className="h2-bold mb-3">Избери размер</h2>
      <div className="flex flex-wrap gap-2">
        {sortedSizes.map((s) => (
          <Badge
            key={s.size}
            variant="outline"
            className={`cursor-pointer ${
              selectedSize === s.size
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => onSizeSelect(s.size)}
          >
            {s.size}
          </Badge>
        ))}
      </div>
      {selectedSize && selectedSizeQuantity === 0 && (
        <p className="text-red-500 mt-2">Няма в наличност</p>
      )}
    </div>
  );
};

export default ProductSizes;
