package Payment;

class FeeDecorator implements Payment {
    Payment core;
    FeeDecorator(Payment p) { this.core = p; }
    
    public double pay(double amount) { 
        return core.pay(amount + 2.0); // Cộng thêm 2$ phí
    } 
}