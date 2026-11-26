package br.com.financecontrol.controller;

import br.com.financecontrol.model.Bill;
import br.com.financecontrol.repository.BillRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillRepository repository;
    public BillController(BillRepository repository){this.repository=repository;}

    @GetMapping public List<Bill> list(){return repository.findAll();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Bill create(@Valid @RequestBody Bill bill){bill.setId(null);return repository.save(bill);}
    @PatchMapping("/{id}/pay")
    public Bill pay(@PathVariable Long id){
        Bill bill=repository.findById(id).orElseThrow(()->new IllegalArgumentException("Conta não encontrada"));
        bill.setPaid(true);return repository.save(bill);
    }
}
