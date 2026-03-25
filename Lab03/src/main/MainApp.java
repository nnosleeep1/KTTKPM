package main;

import java.util.Observer;

import decorator.BasicBorrow;
import decorator.ExtendedBorrow;
import observer.UserObserver;
import singleton.Library;
import strategy.SearchByTitle;

public class MainApp {
 public static void main(String[] args) {
     Library library = Library.getInstance();

    
     library.detachObserver((Observer) new UserObserver("Alice"));


     library.addBook("paper", "Design Patterns", "Gamma", "Software");
     library.addBook("ebook", "Clean Code", "Martin", "Programming");

    
     var results = library.searchBooks(new SearchByTitle(), "Design");
     for (var book : results) {
         System.out.println(book.getInfo());
     }


     var borrow = new ExtendedBorrow(new BasicBorrow());
     borrow.borrowBook("Design Patterns");
 }
}