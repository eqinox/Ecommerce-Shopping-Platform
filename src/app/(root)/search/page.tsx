import { X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { getServerTranslations } from "@/i18n/server";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ""}
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const ratings = [4, 3, 2, 1];

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const { t } = await getServerTranslations("search");
  const { t: commonT } = await getServerTranslations();
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const prices = [
    {
      name: t("prices.1"),
      value: "1-50",
    },
    {
      name: t("prices.2"),
      value: "51-100",
    },
    {
      name: t("prices.3"),
      value: "101-200",
    },
    {
      name: t("prices.4"),
      value: "201-500",
    },
    {
      name: t("prices.5"),
      value: "501-1000",
    },
  ];

  const sortOrders = [
    {
      value: "newest",
      label: t("sort.newest"),
    },
    {
      value: "lowest",
      label: t("sort.lowest"),
    },
    {
      value: "highest",
      label: t("sort.highest"),
    },
    {
      value: "rating",
      label: t("sort.rating"),
    },
  ];

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  });
  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mt-3 mb-2 flex gap-2">
          <SlidersHorizontal /> {t("department")}
        </div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  ("all" === category || "" === category) && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                {t("any")}
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${x.category === category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div>
          <div className="text-xl mt-8 mb-2">{commonT("price")}</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`  ${"all" === price && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                {t("any")}
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`${p.value === price && "font-bold"}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Links */}
        <div>
          <div className="text-xl mt-8 mb-2">{t("customerReview")}</div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ r: "all" })}
                className={`  ${"all" === rating && "font-bold"}`}
              >
                {t("any")}
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`${r.toString() === rating && "font-bold"}`}
                >
                  {`${r} ${t("starsAndUp")}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query : " + q}
            {category !== "all" &&
              category !== "" &&
              `   ${t("category")} : ` + category}
            {price !== "all" && "    Price: " + price}
            {rating !== "all" && "    Rating: " + rating + " & up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild>
                <Link href="/search">
                  {t("clear")} <X />
                </Link>
              </Button>
            ) : null}
          </div>
          <div>
            {t("sortBy")}{" "}
            {sortOrders.map((s) => (
              <Link
                key={s.value}
                className={`mx-2   ${sort == s.value && "font-bold"} `}
                href={getFilterUrl({ s: s.value })}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products!.data.length === 0 && (
            <div>{commonT("notFound.products")}</div>
          )}
          {products!.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
