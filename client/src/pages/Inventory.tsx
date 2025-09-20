import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Candy, Home, Flower, Leaf, Trash, Coffee } from "lucide-react";
import { sweetService } from "@/services/SweetService";
import { getCategories } from "@/services/SweetService";
import type { Sweet } from "@/services/SweetService";
import { deleteSweet } from "@/services/SweetService";
import AddSweetDrawer from "@/components/AddSweetDrawer";
import PurchaseSweet from "@/components/PurchaseSweet";
import CartDrawer from "@/components/CartDrawer";
import RestockModal from "@/components/RestockSweet";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/store/AuthStore";

const InventoryPage = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]); // ✅ Typed as Sweet[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>("all");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<string>("name"); // default sort
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // sweets per page
  const { removeFromCart } = useCart();
  const { user } = useAuthStore();
  
  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  const handleDeleteSweet = async (id: string) => {
    try {
      await deleteSweet(id);
      removeFromCart(id);
      setSweets(sweets.filter((sweet) => sweet._id !== id));
    } catch (error) {
      console.error("Error deleting sweet:", error);
    }
  };

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (name) queryParams.append("name", name);
      if (categoryFilter && categoryFilter !== "all") {
        queryParams.append("category", categoryFilter);
      }
      if (priceRange) {
        queryParams.append("minPrice", priceRange[0].toString());
        queryParams.append("maxPrice", priceRange[1].toString());
      }
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (order) queryParams.append("order", order);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const data = await sweetService.getAllSweets(
        `?${queryParams.toString()}`
      );
      setSweets(data.sweets);
      setTotalPages(data.totalPages);
      const uniqueCategories = await getCategories();

      setCategories(uniqueCategories as string[]);
    } catch (err) {
      setError("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [name, categoryFilter, priceRange, sortBy, order, page, limit]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 relative overflow-hidden">
      {/* Floral Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 text-slate-300 opacity-15">
          <Flower className="h-28 w-28 transform rotate-12" />
        </div>
        <div className="absolute bottom-40 left-20 text-stone-300 opacity-10">
          <Leaf className="h-32 w-32 transform -rotate-12" />
        </div>
        <div className="absolute top-1/2 left-1/2 text-gray-300 opacity-5">
          <Flower className="h-48 w-48 transform rotate-45" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-slate-700 to-gray-800 p-2 rounded-xl shadow-lg">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
                Roastea Sweets
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && <AddSweetDrawer onAdd={fetchSweets} />}
              <CartDrawer />
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-slate-400 text-slate-700 hover:bg-slate-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Garden
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Inventory Section */}
      <section className="py-8 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-slate-600 mr-3" />
              <h2 className="text-4xl font-bold text-slate-800">
                Sweet Garden Collection
              </h2>
              <Flower className="h-8 w-8 text-stone-500 ml-3" />
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Browse through our carefully curated selection of artisanal
              sweets, each one a delicate bloom in our confectionery garden
            </p>
          </div>
          <div className="max-w-md mx-auto mb-6">
            <Input
              type="text"
              placeholder="Search by Sweet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-400 text-slate-700 hover:bg-slate-50 px-6 py-5 text-sm cursor-pointer rounded-2xl shadow-sm hover:shadow-md transition-all"
            />
          </div>
          {/* Category Filter */}

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Select onValueChange={setCategoryFilter}>
              <SelectTrigger className=" w-[210px] bg-gradient-to-r from-slate-700 to-gray-800 text-white px-9 py-5 text-sm rounded-2xl shadow-lg">
                <SelectValue
                  placeholder="Filter by Category"
                  className="text-white placeholder-white"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                if (value === "all") setPriceRange([0, Infinity]);
                else if (value === "lt20") setPriceRange([0, 20]);
                else if (value === "20to50") setPriceRange([20, 50]);
                else if (value === "gt50") setPriceRange([50, 1000]);
              }}
            >
              <SelectTrigger className="w-[200px] bg-gradient-to-r from-slate-700 to-gray-800 text-white  px-9 py-5  rounded-2xl shadow-md ">
                <SelectValue placeholder="Filter by Price" />
              </SelectTrigger>

              <SelectContent className="bg-white shadow-lg rounded-md">
                <SelectItem
                  value="all"
                  className="px-4 py-2 cursor-pointer text-black hover:bg-slate-200 data-[state=checked]:bg-slate-300"
                >
                  All Prices
                </SelectItem>
                <SelectItem
                  value="lt20"
                  className="px-4 py-2 cursor-pointer text-black hover:bg-slate-200 data-[state=checked]:bg-slate-300"
                >
                  Less than ₹20
                </SelectItem>
                <SelectItem
                  value="20to50"
                  className="px-4 py-2 cursor-pointer text-black hover:bg-slate-200 data-[state=checked]:bg-slate-300"
                >
                  ₹20 – ₹50
                </SelectItem>
                <SelectItem
                  value="gt50"
                  className="px-4 py-2 cursor-pointer text-black hover:bg-slate-200 data-[state=checked]:bg-slate-300"
                >
                  More than ₹50
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Sort By and Order */}
            <Select onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] bg-gradient-to-r from-slate-700 to-gray-800 text-white  px-9 py-5 text-sm rounded-2xl shadow-lg ">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setOrder(value === "asc" ? "asc" : "desc")
              }
            >
              <SelectTrigger className="w-[200px] bg-gradient-to-r from-slate-700 to-gray-800 text-white px-9 py-5 rounded-2xl shadow-md ">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Inventory Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets &&
              Array.isArray(sweets) &&
              sweets.map((sweet) => (
                <Card
                  key={sweet._id}
                  className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-slate-300 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Flower className="h-6 w-6" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-slate-800 leading-tight pr-8">
                        {sweet.name}
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-slate-700 to-gray-800 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        {sweet.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium flex items-center">
                          <Leaf className="h-4 w-4 mr-1" />
                          Price:
                        </span>
                        <span className="text-2xl font-bold text-slate-800">
                          Rs.{sweet.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium flex items-center">
                          <Flower className="h-4 w-4 mr-1" />
                          In Stock:
                        </span>
                        <Badge
                          variant={
                            sweet.quantity > 20
                              ? "default"
                              : sweet.quantity > 10
                              ? "secondary"
                              : "destructive"
                          }
                          className={`${
                            sweet.quantity > 20
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : sweet.quantity > 10
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } rounded-full px-3 py-1`}
                        >
                          {sweet.quantity} items
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex-1">
                          <PurchaseSweet
                            sweetId={sweet._id}
                            sweetName={sweet.name}
                            price={sweet.price}
                            availableQty={sweet.quantity}
                            onPurchased={fetchSweets} // Refetch sweets after purchase
                          />
                        </div>

                        {isAdmin && (
                          <Button
                            variant="destructive"
                            className="p-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl flex-shrink-0"
                            onClick={() => handleDeleteSweet(sweet._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isAdmin && (
                        <RestockModal
                          sweetId={sweet._id}
                          sweetName={sweet.name}
                          onRestocked={fetchSweets}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            <span className="text-slate-700">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
          {/* Summary Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all">
              <CardContent className="py-8">
                <div className="flex items-center justify-center mb-3">
                  <Flower className="h-8 w-8 text-slate-600 mr-2" />
                  <div className="text-4xl font-bold text-slate-800">
                    {sweets.length}
                  </div>
                </div>
                <div className="text-slate-600 font-medium">
                  Sweet Varieties
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all">
              <CardContent className="py-8">
                <div className="flex items-center justify-center mb-3">
                  <Leaf className="h-8 w-8 text-slate-600 mr-2" />
                  <div className="text-4xl font-bold text-slate-800">
                    {categories.length}
                  </div>
                </div>
                <div className="text-slate-600 font-medium">
                  Garden Sections
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all">
              <CardContent className="py-8">
                <div className="flex items-center justify-center mb-3">
                  <Candy className="h-8 w-8 text-slate-600 mr-2" />
                  <div className="text-4xl font-bold text-slate-800">
                    {Array.isArray(sweets)
                      ? sweets.reduce((sum, sweet) => sum + sweet.quantity, 0)
                      : 0}
                  </div>
                </div>
                <div className="text-slate-600 font-medium">Total Blooms</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InventoryPage;
