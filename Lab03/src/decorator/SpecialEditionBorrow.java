package decorator;

public class SpecialEditionBorrow extends BorrowDecorator {
    public SpecialEditionBorrow(Borrow decoratedBorrow) {
        super(decoratedBorrow);
    }

    @Override
    public void borrowBook(String bookTitle) {
        super.borrowBook(bookTitle);
        requestSpecialEdition(bookTitle);
    }

    private void requestSpecialEdition(String bookTitle) {
        System.out.println("Requested special edition for: " + bookTitle);
    }
}