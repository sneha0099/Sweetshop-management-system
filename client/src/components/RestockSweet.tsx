import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { restocktheSweet } from "@/services/SweetService";

type Props = {
  sweetId: string;
  sweetName: string;
  onRestocked?: () => void;
};

const RestockModal = ({ sweetId, sweetName, onRestocked }: Props) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRestock = async () => {
    setLoading(true);
    try {
      await restocktheSweet(sweetId, quantity);
      setMessage("✅ Restocked successfully!");
      onRestocked?.(); // Re-fetch inventory
      setTimeout(() => {
        setMessage("");
        setOpen(false);
      }, 1000);
    } catch {
      setMessage("❌ Failed to restock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-200 hover:bg-green-400 text-green-700 rounded-2xl w-full">
          Restock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock: {sweetName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full border px-3 py-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <Button
            onClick={handleRestock}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading || quantity <= 0}
          >
            {loading ? "Restocking..." : "Confirm Restock"}
          </Button>

          {message && (
            <p className="text-center text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestockModal;
