
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, MapPin, Clock, Truck } from 'lucide-react';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface Address {
  street: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  instructions: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [address, setAddress] = useState<Address>({
    street: '',
    landmark: '',
    area: '',
    city: 'Mumbai',
    pincode: '',
    instructions: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [deliveryOption, setDeliveryOption] = useState('now');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const timeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM', 
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM'
  ];

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `ORD-${Date.now()}`;
    
    // Store order in localStorage (in real app, this would go to backend)
    const order = {
      id: orderId,
      items: cart.items,
      customerInfo,
      address,
      paymentMethod,
      deliveryOption,
      timeSlot: selectedTimeSlot,
      total: cart.grandTotal,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('sonnas-orders') || '[]');
    localStorage.setItem('sonnas-orders', JSON.stringify([order, ...existingOrders]));
    
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (cart.itemCount === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack onBack={() => navigate('/cart')} title="Checkout" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button onClick={() => navigate('/menu')} className="mt-4">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBack onBack={() => navigate('/cart')} title="Checkout" />
      
      <div className="p-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {num}
              </div>
              {num < 4 && <div className={`w-12 h-0.5 mx-2 ${
                step > num ? 'bg-primary' : 'bg-muted'
              }`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Customer Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📞</span> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleNextStep}
                disabled={!customerInfo.name || !customerInfo.phone}
              >
                Continue to Delivery Address
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Delivery Address */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="Building name, flat number, street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={address.landmark}
                    onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Near famous place"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    value={address.area}
                    onChange={(e) => setAddress(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="Locality/Area"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="400001"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Delivery Instructions</Label>
                <Textarea
                  id="instructions"
                  value={address.instructions}
                  onChange={(e) => setAddress(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Any specific instructions for delivery person"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="flex-1"
                  disabled={!address.street || !address.area || !address.pincode}
                >
                  Continue to Delivery Time
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Delivery Time */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                When do you want it?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Deliver Now (30-45 mins)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled">Schedule for Later</Label>
                </div>
              </RadioGroup>

              {deliveryOption === 'scheduled' && (
                <div className="space-y-4">
                  <Label>Select Time Slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTimeSlot === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className="text-xs"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="flex-1"
                  disabled={deliveryOption === 'scheduled' && !selectedTimeSlot}
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment & Order Summary */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.customizations)}`} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name} x {item.quantity}</p>
                      {item.customizations.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cart.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{cart.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{cart.gst.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{cart.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Razorpay (Cards, UPI, Wallets)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      UPI (GPay, PhonePe, Paytm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Digital Wallets
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order ₹${cart.grandTotal.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
