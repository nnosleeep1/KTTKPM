package order;

public class main {
    public static void main(String[] args) {
        System.out.println("=== KỊCH BẢN 1: Đơn hàng thành công ===");
        Order order1 = new Order();
        order1.processOrder(); 
        order1.processOrder();
        
        System.out.println("\n=== KỊCH BẢN 2: Đơn hàng bị hủy giữa chừng ===");
        Order order2 = new Order();
        order2.processOrder(); 
        order2.cancelOrder();  
}
}