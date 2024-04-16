import axios from "axios";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSession } from "next-auth/react";
import { LoaderButton } from "../utility/LoaderButton";

const ExistingStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productAddLoading, setProductAddLoading] = useState(false);

  const { data: session, status } = useSession();

  const [productData, setProductData] = useState({
    productName: "",
    storeId: session.user.id,
    category: "",
    subcategory: "",
    imagePaths: [],
    pricing: {
      mrp: "",
      costPrice: "",
      salesPrice: "",
    },
    description: "",
    tags: [],
  });
  const [editedDescription, setEditedDescription] = useState([]);

  const handleDescriptionChange = (index, field, event) => {
    const newDescription = [...editedDescription];
    newDescription[index][field] = event.target.value;
    setEditedDescription(newDescription);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/product/fetch-search-products", {
        searchQuery: searchTerm,
      });

      setSearchResults(data.products);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    setProductData({
      productName: product.productName,
      storeId: session.user.id,
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
    setEditedDescription(product.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductAddLoading(true);

    try {
      const { data } = await axios.post("/api/product/add-new-product", {
        productData: { ...productData, description: editedDescription },
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      setProductData({
        productName: "",
        storeId: session.user.id,
        category: "",
        subcategory: "",
        pricing: {
          mrp: "",
          costPrice: "",
          salesPrice: "",
        },
        description: "",
        tags: [],
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setProductAddLoading(false);
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
    <div className="p-2 bg-gray-100">
      {/* Search Bar */}
      <div className="mb-4 flex flex-col gap-2">
        <Label className="text-lg font-semibold">Search for a product</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={handleSearch}>Search</Button>
          )}
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
                  className="bg-white cursor-pointer text-gray-700 w-44 border rounded-lg m-3 flex flex-col items-center p-2"
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
          <Label className="text-lg font-semibold">
            Verify Product Details
          </Label>
          <div className="my-4">
            <Label htmlFor="productName">Product Name:</Label>
            <Input
              type="text"
              id="productName"
              name="productName"
              value={productData.productName}
              onChange={handleFieldChange}
            />
          </div>

          <div className="flex gap-2">
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

          <div>
            <Label className="font-semibold">Description:</Label>
            {editedDescription.map((desc, index) => (
              <div
                key={index}
                className="border flex flex-col p-2 rounded-md mb-2 gap-2"
              >
                <Input
                  value={desc.heading}
                  onChange={(e) => handleDescriptionChange(index, "heading", e)}
                />
                <Textarea
                  value={desc.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, "description", e)
                  }
                />
              </div>
            ))}
          </div>

          <div>
            <LoaderButton
              title="Add Stock"
              loading={productAddLoading}
              type="submit"
            />
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
