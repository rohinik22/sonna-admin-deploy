
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/BottomNav";
import { ShoppingCart, ArrowRight, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem } = useCart();

  const handleIncrement = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  if (state.itemCount === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header 
          showBack 
          onBack={() => navigate(-1)} 
          title="🛒 Cart"
        />
        
        {/* Empty Cart State */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]">
          <div className="empty-state-icon mb-6">
            <ShoppingCart className="w-24 h-24 text-muted-foreground" />
          </div>
          
          <h2 className="empty-state-title font-playfair text-2xl mb-4">
            Your cart is empty
          </h2>
          
          <p className="empty-state-description font-poppins text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added any delicious items to your cart yet. 
            Let's find something that makes your taste buds dance!
          </p>
          
          <div className="space-y-4 w-full max-w-sm">
            <Button 
              className="w-full cta-primary font-poppins font-semibold"
              onClick={() => navigate('/menu')}
            >
              Browse Menu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full font-poppins"
              onClick={() => navigate('/cakes')}
            >
              🎂 Order Birthday Cake
            </Button>
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        onBack={() => navigate(-1)} 
        title="🛒 Cart"
      />
      
      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <div className="space-y-4">
          {state.items.map((item) => (
            <Card key={`${item.id}-${JSON.stringify(item.customizations)}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold font-playfair">{item.name}</h3>
                        {item.customizations.length > 0 && (
                          <p className="text-sm text-muted-foreground font-poppins">
                            {item.customizations.join(', ')}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg font-poppins">₹{item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1">
                        <Button 
                          onClick={() => handleDecrement(item.id, item.quantity)}
                          size="sm" 
                          variant="ghost"
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-bold min-w-[2rem] text-center font-poppins">
                          {item.quantity}
                        </span>
                        <Button 
                          onClick={() => handleIncrement(item.id, item.quantity)}
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full bg-primary text-primary-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-right font-semibold font-poppins">
                      Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bill Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold font-playfair">Bill Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-poppins">Subtotal ({state.itemCount} items)</span>
                <span className="font-poppins">₹{state.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-poppins">Delivery Fee</span>
                <span className="font-poppins">
                  {state.deliveryFee === 0 ? 'FREE' : `₹${state.deliveryFee}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-poppins">GST (18%)</span>
                <span className="font-poppins">₹{state.gst.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span className="font-poppins">Total Amount</span>
                <span className="font-poppins">₹{state.grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {state.total < 500 && (
              <p className="text-xs text-muted-foreground font-poppins">
                Add ₹{(500 - state.total).toFixed(2)} more for free delivery!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button 
          className="w-full h-12 text-lg font-semibold font-poppins"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Cart;
