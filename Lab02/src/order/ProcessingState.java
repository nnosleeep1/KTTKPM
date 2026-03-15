package order;

public class ProcessingState implements OrderState {
    @Override
    public void handleAction(Order context) {
        System.out.println("Trạng thái: ĐANG XỬ LÝ. Đang đóng gói và vận chuyển...");
        context.setState(new DeliveredState());
    }
}