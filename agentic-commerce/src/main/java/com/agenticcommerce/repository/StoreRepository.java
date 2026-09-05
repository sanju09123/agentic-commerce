package com.agenticcommerce.repository;

import com.agenticcommerce.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, String> {

    Optional<Store> findBySellerId(String sellerId);

    boolean existsBySellerId(String sellerId);
}