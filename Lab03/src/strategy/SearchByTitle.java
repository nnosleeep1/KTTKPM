package strategy;



import java.util.List;
import java.util.stream.Collectors;

import factory.Book;

public class SearchByTitle implements SearchStrategy {
 @Override
 public List<Book> search(List<Book> books, String keyword) {
     return books.stream()
             .filter(b -> b.getTitle().toLowerCase().contains(keyword.toLowerCase()))
             .collect(Collectors.toList());
 }
}