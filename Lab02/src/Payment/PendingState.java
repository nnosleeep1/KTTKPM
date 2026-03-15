package Payment;

class PendingState implements State {
    public void process(Order o, Payment p, double amt) {
        System.out.println("Thanh toán thành công: $" + p.pay(amt));
        o.state = new PaidState(); // Thanh toán xong -> Khóa giao dịch
    }
}
