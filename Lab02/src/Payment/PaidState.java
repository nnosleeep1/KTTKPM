package Payment;

class PaidState implements State {
    public void process(Order o, Payment p, double amt) {
        System.out.println("❌ Lỗi: Đơn hàng này đã được thanh toán rồi!");
    }
}