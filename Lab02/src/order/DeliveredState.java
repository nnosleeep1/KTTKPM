package order;

public class DeliveredState implements OrderState {
    @Override
    public void handleAction(Order context) {
        System.out.println("Trạng thái: ĐÃ GIAO. Cập nhật hệ thống thành công.");
    }
}