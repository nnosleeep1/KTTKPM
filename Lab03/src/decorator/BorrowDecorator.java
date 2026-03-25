package decorator;

public abstract class BorrowDecorator implements Borrow {
    protected Borrow decoratedBorrow;

    public BorrowDecorator(Borrow decoratedBorrow) {
        this.decoratedBorrow = decoratedBorrow;
    }

    @Override
    public void borrowBook(String bookTitle) {
        decoratedBorrow.borrowBook(bookTitle);
    }}