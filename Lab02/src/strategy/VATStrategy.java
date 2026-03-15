package strategy;


public class VATStrategy implements TaxStrategy {
    @Override
    public double calculateBaseTax(double price) {
        return price * 0.10; // Thuế VAT 10%
    }
}