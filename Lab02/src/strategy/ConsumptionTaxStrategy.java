package strategy;

public class ConsumptionTaxStrategy implements TaxStrategy {
    @Override
    public double calculateBaseTax(double price) {
        return price * 0.05; // Thuế tiêu thụ 5%
    }
}