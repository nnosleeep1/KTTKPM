package strategy;


public class Product implements PriceCalculator {
    private String name;
    private double originalPrice;
    private TaxStrategy taxStrategy; 
    private ProductState state;      

    public Product(String name, double originalPrice, TaxStrategy taxStrategy) {
        this.name = name;
        this.originalPrice = originalPrice;
        this.taxStrategy = taxStrategy;
        this.state = new NewArrivalState(); // Trạng thái mặc định
    }

    public void setState(ProductState state) {
        this.state = state;
    }
    
    public void ageProduct() {
        this.state.nextState(this);
    }

    @Override
    public double calculateTax() {
        double taxablePrice = state.getTaxablePrice(originalPrice);
        return taxStrategy.calculateBaseTax(taxablePrice);
    }

    @Override
    public double getFinalPrice() {
        return originalPrice + calculateTax();
    }
    
    public String getName() { 
        return name; 
    }
}