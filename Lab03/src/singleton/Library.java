package singleton;



import java.util.ArrayList;
import java.util.List;
import java.util.Observer;

import factory.Book;
import factory.BookFactory;
import strategy.SearchStrategy;

public class Library {
    private static Library instance;
    private List<Book> books;
    private List<Observer> observers;

    private Library() {
        books = new ArrayList<>();
        observers = new ArrayList<>();
    }

    public static synchronized Library getInstance() {
        if (instance == null) instance = new Library();
        return instance;
    }

    public void addBook(String type, String title, String author, String category) {
        Book book = BookFactory.createBook(type, title, author, category);
        if (book != null) {
            books.add(book);
            notifyObservers("New book added: " + title);
        }
    }

    public List<Book> searchBooks(SearchStrategy strategy, String keyword) {
        return strategy.search(books, keyword);
    }

    public void attachObserver(Observer observer) {
        observers.add(observer);
    }

    public void detachObserver(Observer observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String message) {
        for (Observer obs : observers) {
            obs.update(null, message);
        }
    }

   
}