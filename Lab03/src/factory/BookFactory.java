package factory;


public class BookFactory {
 public static Book createBook(String type, String title, String author, String category) {
     switch (type.toLowerCase()) {
         case "paper":
             return new PaperBook(title, author, category);
         case "ebook":
             return new Ebook(title, author, category);
         case "audiobook":
             return new AudioBook(title, author, category);
         default:
             System.out.println("Unknown book type");
             return null;
     }
 }
}