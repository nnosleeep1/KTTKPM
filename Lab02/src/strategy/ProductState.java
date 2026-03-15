package strategy;

public interface ProductState {
    double getTaxablePrice(double originalPrice);
    void nextState(Product product);
}