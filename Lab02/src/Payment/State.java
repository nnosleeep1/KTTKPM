package Payment;
interface State { void process(Order o, Payment p, double amt); }