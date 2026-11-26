package br.com.financecontrol.controller;

import br.com.financecontrol.model.User;
import br.com.financecontrol.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repository;
    public UserController(UserRepository repository){this.repository=repository;}

    @GetMapping public List<User> list(){
        // Não exponha senhas em aplicações reais. Este endpoint é apenas didático.
        return repository.findAll();
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public User create(@Valid @RequestBody User user){
        if(repository.findByEmail(user.getEmail()).isPresent()) throw new IllegalArgumentException("E-mail já cadastrado");
        user.setId(null);return repository.save(user);
    }
}
