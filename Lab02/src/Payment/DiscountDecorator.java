package Payment;

class DiscountDecorator implements Payment {
    Payment corePay;
    DiscountDecorator(Payment p) { this.corePay = p; }
    
    public double pay(double amount) { 
        return corePay.pay(amount * 0.9); // Áp mã giảm 10%
    } 
}