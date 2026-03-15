package strategy;

public abstract class TaxDecorator implements PriceCalculator {
    protected PriceCalculator wrappedItem;

    public TaxDecorator(PriceCalculator item) {
        this.wrappedItem = item;
    }
}