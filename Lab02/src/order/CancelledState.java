package order;

public class CancelledState implements OrderState {
    @Override
    public void handleAction(Order context) {
        System.out.println("Trạng thái: HỦY. Đã hủy đơn và hoàn tiền.");
    }
}