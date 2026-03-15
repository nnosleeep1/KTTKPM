package strategy;

public class ClearanceState implements ProductState {
    @Override
    public double getTaxablePrice(double originalPrice) {
        return originalPrice * 0.5; // Hàng thanh lý: Chỉ tính thuế trên 50% giá trị
    }

    @Override
    public void nextState(Product product) {
        System.out.println("Sản phẩm đã ở trạng thái cuối cùng, không thể chuyển đổi.");
    }
}