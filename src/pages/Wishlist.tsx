
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { Heart, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem(item);
    removeFromWishlist(item.id);
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header 
          showBack 
          onBack={() => navigate(-1)} 
          title="💖 Wishlist"
        />
        
        {/* Empty Wishlist State */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]">
          <div className="empty-state-icon mb-6">
            <Heart className="w-24 h-24 text-muted-foreground" />
          </div>
          
          <h2 className="empty-state-title font-playfair text-2xl mb-4">
            Your wishlist is empty
          </h2>
          
          <p className="empty-state-description font-poppins text-muted-foreground mb-8 max-w-sm">
            Start building your collection of favorites! 
            Save items you love for easy ordering later.
          </p>
          
          <div className="space-y-4 w-full max-w-sm">
            <Button 
              className="w-full cta-primary font-poppins font-semibold"
              onClick={() => navigate('/menu')}
            >
              Discover Food
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full font-poppins"
              onClick={() => navigate('/cakes')}
            >
              🎂 Browse Cakes
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
        title="💖 Wishlist"
      />
      
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-playfair">Your Favorites</h1>
          <p className="text-muted-foreground font-poppins">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold font-playfair">{item.name}</h3>
                        <p className="text-sm text-muted-foreground font-poppins">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary font-poppins">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through font-poppins">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full font-poppins font-semibold"
            onClick={() => navigate('/menu')}
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Wishlist;
