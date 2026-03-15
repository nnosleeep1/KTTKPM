package Payment;

class Order {
    State state = new PendingState(); // Mới tạo thì ở trạng thái Chờ
    void checkout(Payment p, double amt) { state.process(this, p, amt); }
}
