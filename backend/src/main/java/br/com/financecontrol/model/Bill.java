package br.com.financecontrol.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false, length = 100)
    private String description;
    @NotNull @DecimalMin("0.01") @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    @NotNull @Column(nullable = false)
    private LocalDate dueDate;
    @Column(nullable = false)
    private boolean paid = false;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){dueDate=v;}
    public boolean isPaid(){return paid;} public void setPaid(boolean v){paid=v;}
}
