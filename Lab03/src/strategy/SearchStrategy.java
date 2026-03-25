package strategy;


import java.util.List;

import factory.Book;

public interface SearchStrategy {
 List<Book> search(List<Book> books, String keyword);
}