package com.example.wero.core.user.infrastructure;

import com.example.wero.core.user.domain.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserEmail(String userEmail);
    
    @Query(value = "SELECT user_nick_name FROM users WHERE user_id = :userId", nativeQuery = true)
    String findUserNickName(@Param("userId") String userId);

}
