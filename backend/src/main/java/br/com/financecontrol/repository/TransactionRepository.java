package br.com.financecontrol.repository;
import br.com.financecontrol.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {}
