package br.com.financecontrol.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false, length = 100)
    private String name;
    @Email @NotBlank @Column(nullable = false, unique = true, length = 140)
    private String email;
    // Projeto didático: em produção, armazene somente hash de senha com BCrypt.
    @NotBlank @Size(min = 6) @Column(nullable = false)
    private String password;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
}
