package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByVnpayTxnRef(String vnpayTxnRef);
}
