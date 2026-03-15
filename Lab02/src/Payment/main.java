package Payment;

public class main {
	public static void main(String[] args) {
        // Lắp ráp: Thanh toán bằng Thẻ tín dụng + Tính thêm phí
        Payment myPay = new FeeDecorator(new CreditCard());
        
        Order order = new Order();
        order.checkout(myPay, 100); // Lần 1: Bị trừ $102 (Thành công)
        order.checkout(myPay, 100); // Lần 2: Bị chặn đứng (Bảo vệ bởi State)
    }
}