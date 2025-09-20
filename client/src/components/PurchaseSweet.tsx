import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { purchasetheSweet } from "@/services/SweetService";

interface Props {
  sweetId: string;
  sweetName: string;
  availableQty: number;
  price: number;
  onPurchased?: () => void;
}

const PurchaseSweet = ({
  sweetId,
  sweetName,
  availableQty,
  price,
  onPurchased,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();

  const handlePurchase = async () => {
    if (quantity <= 0 || quantity > availableQty) {
      setMessage("Invalid quantity");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await purchasetheSweet(sweetId, quantity);
      addToCart({ _id: sweetId, name: sweetName, price, quantity });
      setMessage("✅ Added to bouquet!");
      onPurchased?.();
      setTimeout(() => {
        setOpen(false);
      }, 800);
    } catch (err) {
      setMessage("❌ Failed to purchase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white shadow-lg rounded-full"
          disabled={availableQty === 0}
        >
          Add to Bouquet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {sweetName}</DialogTitle>
          <DialogDescription>
            Select quantity to add to bouquet.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          value={quantity}
          min={1}
          max={availableQty}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          placeholder="Enter quantity"
        />
        <Button className="w-full" onClick={handlePurchase} disabled={loading}>
          {loading ? "Purchasing..." : "Confirm Purchase"}
        </Button>
        {message && <p className="text-sm text-muted-foreground mt-2">{message}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseSweet;
