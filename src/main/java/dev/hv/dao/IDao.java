package dev.hv.dao;

import java.util.UUID;

public interface IDao<T> {
    void create(T obj);
    T read(UUID id);
    void update(T obj);
    void delete(int id);
}
