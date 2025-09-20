
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Trash, Candy } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { cart, clearCart, removeFromCart } = useCart();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button className="bg-gradient-to-r from-slate-700 to-gray-800 text-white">
          🛒 View Cart
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-6 max-w-md ml-auto">
        <DrawerHeader>
          <DrawerTitle>Your Sweet Cart</DrawerTitle>
          <DrawerDescription>
            Review your bouquet before checkout 🍬
          </DrawerDescription>
        </DrawerHeader>

        {cart.length === 0 ? (
          <div className="text-center mt-10 text-muted-foreground">
            <Candy className="mx-auto mb-2 h-10 w-10 text-pink-400" />
            <p className="text-lg font-medium">Your cart is empty!</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4 px-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start border-b pb-3"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-600">
                    {item.quantity} × ₹{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-semibold text-slate-800">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-red-500 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="destructive" onClick={clearCart}>
                <Trash className="h-4 w-4 mr-2" /> Clear
              </Button>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
