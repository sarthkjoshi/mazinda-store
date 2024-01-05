import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const ReviewProduct = ({ productData }) => {
  return (
    <>
      <div className="md:mx-auto mb-20">
        {/* <div className="mb-8">
          {productData.imagePaths.length > 0 && (
            <div className="flex justify-center">
              <ul className="flex flex-wrap gap-4">
                {productData.imagePaths.map((imageName, index) => (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      className="w-24 aspect-square border rounded-md p-2"
                      src={imageName}
                      key={index}
                    />
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div> */}

        <div className="text-lg mb-5 mt-2">{productData.productName}</div>

        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>MRP</TableHead>
              <TableHead>Cost Price</TableHead> */}
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {/* <TableCell>{productData.pricing.mrp}</TableCell>
              <TableCell>{productData.pricing.costPrice}</TableCell> */}
              <TableCell>{productData.category}</TableCell>
              <TableCell>{productData.subcategory}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* {productData.description.map((item, index) => (
          <div key={index} className="border py-2 px-3 rounded-lg my-3">
            <Label className="text-lg text-[#64748b] mx-4">
              {item.heading}
            </Label>
            <hr />

            <div className="flex justify-between items-center mt-3">
              <p className="mx-5 text-gray-800">
                {item.description.split("\n").map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < item.description.split("\n").length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default ReviewProduct;
