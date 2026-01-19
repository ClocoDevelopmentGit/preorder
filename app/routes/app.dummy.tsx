import { useEffect, useMemo, useState, ChangeEvent } from "react";

// 🔹 Declare custom Shopify elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "s-page": any;
      "s-section": any;
      "s-text-field": any;
      "s-table": any;
      "s-table-head": any;
      "s-table-body": any;
      "s-table-row": any;
      "s-table-cell": any;
      "s-unordered-list": any;
      "s-list-item": any;
      "s-link": any;
    }
  }
}

// 🔹 Define product type
interface Product {
  id: string;
  title: string;
  vendor: string;
  price: number;
  status: string;
}

export default function AdditionalPage() {
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  // 🔹 Mock data (replace with Shopify API later)
  useEffect(() => {
    const mockProducts: Product[] = [
      { id: "1", title: "T-Shirt", vendor: "Nike", price: 999, status: "Active" },
      { id: "2", title: "Hoodie", vendor: "Adidas", price: 1999, status: "Draft" },
      { id: "3", title: "Cap", vendor: "Puma", price: 499, status: "Active" },
    ];
    setProducts(mockProducts);
  }, []);

  // 🔍 Filter products by search
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  const handleSearchChange = (event: Event & { currentTarget: { value: string } }) => {
    setSearch(event.currentTarget.value);
  };

  return (
    <s-page heading="Products">
      <s-section heading="Product List">
        {/* 🔍 Search */}
        <div style={{ marginBottom: "16px", maxWidth: "300px" }}>
          <s-text-field
            label="Search products"
            value={search}
            placeholder="Search by product title"
            onInput={handleSearchChange}
          />
        </div>

        {/* 📦 Table */}
        <s-table>
          <s-table-head>
            <s-table-row>
              <s-table-cell>Title</s-table-cell>
              <s-table-cell>Vendor</s-table-cell>
              <s-table-cell>Price</s-table-cell>
              <s-table-cell>Status</s-table-cell>
            </s-table-row>
          </s-table-head>

          <s-table-body>
            {filteredProducts.length === 0 ? (
              <s-table-row>
                <s-table-cell colSpan={4}>No products found</s-table-cell>
              </s-table-row>
            ) : (
              filteredProducts.map((product) => (
                <s-table-row key={product.id}>
                  <s-table-cell>{product.title}</s-table-cell>
                  <s-table-cell>{product.vendor}</s-table-cell>
                  <s-table-cell>₹{product.price}</s-table-cell>
                  <s-table-cell>{product.status}</s-table-cell>
                </s-table-row>
              ))
            )}
          </s-table-body>
        </s-table>
      </s-section>

      <s-section slot="aside" heading="Resources">
        <s-unordered-list>
          <s-list-item>
            <s-link
              href="https://shopify.dev/docs/api/admin-rest"
              target="_blank"
            >
              Shopify Admin API
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
