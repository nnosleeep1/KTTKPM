package decorator;

public class ExtendedBorrow extends BorrowDecorator {
    public ExtendedBorrow(Borrow decoratedBorrow) {
        super(decoratedBorrow);
    }

    @Override
    public void borrowBook(String bookTitle) {
        super.borrowBook(bookTitle);
        extendBorrowTime(bookTitle);
    }

    private void extendBorrowTime(String bookTitle) {
        System.out.println("Extended borrow time for: " + bookTitle);
    }
}