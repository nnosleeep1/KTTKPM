package strategy;

public class NewArrivalState implements ProductState {
    @Override
    public double getTaxablePrice(double originalPrice) {
        return originalPrice; // Hàng mới: Tính thuế trên 100% giá trị
    }

    @Override
    public void nextState(Product product) {
        product.setState(new ClearanceState());
    }
}