package com.mdddetails.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "subscription")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "subscription_id")
        private Long id;
        @ManyToOne
        @JoinColumn(name = "subject_id", referencedColumnName = "subject_id")
        private SubjectEntity subject;
        @ManyToOne
        @JoinColumn(name = "user_id", referencedColumnName = "user_id")
        private UserEntity user;
}
