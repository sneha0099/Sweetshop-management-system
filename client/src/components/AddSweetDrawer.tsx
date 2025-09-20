import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { addSweet } from "@/services/SweetService";
import { getCategories } from "@/services/SweetService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddSweetDrawerProps = {
  onAdd: () => void | Promise<void>;
};



const AddSweetDrawer: React.FC<AddSweetDrawerProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (open) {
       setMessage("")
      getCategories().then((categories) => setCategories(categories));
    }
  }, [open]);
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      await addSweet({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      setMessage("✅ Sweet added successfully!");
      setForm({ name: "", category: "", price: "", quantity: "" });

      await onAdd(); // Call the onAdd prop to refresh the list

      setTimeout(() => {
        setOpen(false); // close drawer after success
      }, 1000);
    } catch (error) {
      setMessage("❌ Failed to add sweet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-gradient-to-r from-slate-700 to-gray-800 text-white">
          Add Sweet
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-6">
        <DrawerHeader>
          <DrawerTitle>Add a New Sweet</DrawerTitle>
          <DrawerDescription>Fill in the details below:</DrawerDescription>
        </DrawerHeader>

        <div className="grid gap-4 px-6 py-2">
          <Input
            name="name"
            placeholder="Sweet Name"
            value={form.name}
            onChange={handleChange}
          />
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Sweet"}
          </Button>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddSweetDrawer;
