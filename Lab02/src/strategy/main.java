package strategy;

public class main {
	public static void main(String[] args) {
        System.out.println("=== KỊCH BẢN 1: TÍNH THUẾ SẢN PHẨM THÔNG THƯỜNG ===");
        Product coffee = new Product("Cà phê G7 Nhập Khẩu", 100.0, new ConsumptionTaxStrategy());
        System.out.println(coffee.getName() + " - Tiền thuế: $" + coffee.calculateTax() + " | Tổng tiền: $" + coffee.getFinalPrice());

        System.out.println("\n=== KỊCH BẢN 2: THUẾ XẾP CHỒNG (DECORATOR) ===");
        PriceCalculator premiumCoffee = new Product("Set Quà Tặng Legend", 1000.0, new VATStrategy());
        premiumCoffee = new LuxuryTaxDecorator(premiumCoffee); 
        System.out.println("Set Quà Tặng Legend - Tiền thuế tổng cộng: $" + premiumCoffee.calculateTax() + " | Tổng tiền: $" + premiumCoffee.getFinalPrice());

        System.out.println("\n=== KỊCH BẢN 3: ĐỔI TRẠNG THÁI SẢN PHẨM (STATE) ===");
        coffee.ageProduct(); 
        System.out.println(coffee.getName() + " (Đã qua thanh lý) - Tiền thuế: $" + coffee.calculateTax() + " | Tổng tiền: $" + coffee.getFinalPrice());
    }
}
