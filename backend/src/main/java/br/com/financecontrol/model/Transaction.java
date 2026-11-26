package br.com.financecontrol.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false, length = 100)
    private String description;
    @NotBlank @Column(nullable = false, length = 60)
    private String category;
    @NotBlank @Pattern(regexp = "INCOME|EXPENSE")
    @Column(nullable = false, length = 10)
    private String type;
    @NotNull @DecimalMin("0.01") @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    @NotNull @Column(nullable = false)
    private LocalDate date;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public String getType(){return type;} public void setType(String v){type=v;}
    public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
    public LocalDate getDate(){return date;} public void setDate(LocalDate v){date=v;}
}
