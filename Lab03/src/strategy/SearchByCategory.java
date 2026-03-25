package strategy;


import java.util.List;
import java.util.stream.Collectors;

import factory.Book;

public class SearchByCategory implements SearchStrategy {
 @Override
 public List<Book> search(List<Book> books, String keyword) {
     return books.stream()
             .filter(b -> b.getCategory().toLowerCase().contains(keyword.toLowerCase()))
             .collect(Collectors.toList());
 }
}