package br.com.financecontrol.controller;

import br.com.financecontrol.model.Transaction;
import br.com.financecontrol.repository.TransactionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionRepository repository;
    public TransactionController(TransactionRepository repository){this.repository=repository;}

    @GetMapping public List<Transaction> list(){return repository.findAll();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Transaction create(@Valid @RequestBody Transaction transaction){transaction.setId(null);return repository.save(transaction);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){repository.deleteById(id);}
}
