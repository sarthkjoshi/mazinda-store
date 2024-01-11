import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ExistingStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productData, setProductData] = useState({
    productName: "",
    storeToken: Cookies.get("store_token"),
    category: "",
    subcategory: "",
    imagePaths: [],
    pricing: {
      mrp: "",
      costPrice: "",
    },
    description: "",
    tags: [],
  });

  const handleSearch = async () => {
    try {
      const { data } = await axios.post("/api/product/fetch-search-products", {
        searchQuery: searchTerm,
      });

      setSearchResults(data.products);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    setProductData({
      productName: product.productName,
      storeToken: Cookies.get("store_token"),
      category: product.category,
      subcategory: product.subcategory,
      imagePaths: product.imagePaths,
      pricing: {
        mrp: product.pricing.mrp,
        costPrice: product.pricing.costPrice,
      },
      description: product.description,
      tags: product.tags,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/product/add-new-product", {
        productData,
      });

      console.log(data);

      if (data.success) {
        toast.success(data.message, { autoClose: 3000 });
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }

      setProductData({
        productName: "",
        storeToken: Cookies.get("store_token"),
        category: "",
        pricing: {
          mrp: "",
          costPrice: "",
        },
        description: "",
        tags: [],
      });
    } catch (e) {
      toast.error(e.message, { autoClose: 3000 });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      pricing: {
        ...prevData.pricing,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      {/* Search Bar */}
      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="search">Search for a Product:</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Display search results */}
        {!selectedProduct && searchResults.length > 0 && (
          <div className="mt-2">
            <h2 className="mb-3">Search Results:</h2>
            <ul className="flex flex-wrap justify-between">
              {searchResults.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleProductSelection(product)}
                  className="cursor-pointer text-gray-700 w-44 border rounded-lg m-3 flex flex-col items-center p-2"
                >
                  <AspectRatio
                    ratio={1 / 1}
                    className="flex items-center justify-center"
                  >
                    <img
                      className="rounded-lg h-[120px] md:h-[150px]"
                      src={product.imagePaths[0]}
                      alt="Product"
                    />
                  </AspectRatio>
                  <span>{product.productName.slice(0, 50)}...</span>
                  {/* <span className="text-[#f17e13] border border-[#f17e13] rounded-full px-4 text-sm font-bold my-2">Edit</span> */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {
        <form
          onSubmit={handleSubmit}
          className={`mt-5 text-sm ${!selectedProduct ? "hidden" : "block"}`}
        >
          <div className="mb-4">
            <Label htmlFor="productName">Product Name:</Label>
            <Input
              type="text"
              id="productName"
              name="productName"
              value={productData.productName}
              onChange={handleFieldChange}
            />
          </div>

          <div className="flex justify-between">
            <div className="mb-4 mx-1">
              <Label htmlFor="mrp">MRP:</Label>
              <Input
                type="text"
                id="mrp"
                name="mrp"
                value={productData.pricing.mrp}
                onChange={handlePricingChange}
              />
            </div>
            <div className="mb-4 mx-1">
              <Label htmlFor="costPrice">Cost Price:</Label>
              <Input
                type="text"
                id="costPrice"
                name="costPrice"
                value={productData.pricing.costPrice}
                onChange={handlePricingChange}
              />
            </div>
          </div>

          {productData.description &&
            productData.description.map((desc) => {
              return (
                <div className="mb-4" key={desc.heading}>
                  <Label htmlFor="description">{desc.heading}</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    value={desc.description}
                    onChange={handleFieldChange}
                  />
                </div>
              );
            })}

          <div className="w-full flex justify-center">
            <Button type="submit">Add Stock</Button>
            {/* <button
              className="bg-white border border-[#f17e13] mx-2 text-[#f17e13] px-4 py-1 rounded-full hover:opacity-75"
              onClick={() => {
                setSelectedProduct(null);
              }}
            >
              Clear
            </button> */}
          </div>
        </form>
      }
    </div>
  );
};

export default ExistingStock;
