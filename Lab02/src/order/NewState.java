package order;

public class NewState implements OrderState {
    @Override
    public void handleAction(Order context) {
        System.out.println("Trạng thái: MỚI TẠO. Đang kiểm tra thông tin đơn hàng...");
        context.setState(new ProcessingState()); 
    }
}
