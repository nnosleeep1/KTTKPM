package decorator;

public class BasicBorrow implements Borrow {
    @Override
    public void borrowBook(String bookTitle) {
        System.out.println("Borrowed book: " + bookTitle);
    }
}