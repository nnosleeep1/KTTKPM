package order;

public interface OrderState {
    void handleAction(Order context);
}