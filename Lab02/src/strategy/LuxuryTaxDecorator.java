package strategy;

public class LuxuryTaxDecorator extends TaxDecorator {
    public LuxuryTaxDecorator(PriceCalculator item) {
        super(item);
    }

    @Override
    public double calculateTax() {
        // Lấy thuế cũ cộng thêm 20% Thuế xa xỉ (tính trên giá cuối cùng)
        double luxuryTax = wrappedItem.getFinalPrice() * 0.20; 
        return wrappedItem.calculateTax() + luxuryTax;
    }

    @Override
    public double getFinalPrice() {
        return wrappedItem.getFinalPrice() + (wrappedItem.getFinalPrice() * 0.20);
    }
}