# Caching

A cache stores copies of data in a fast layer close to where it is
requested, so future requests are served quicker.

## Hits and misses

**Caching** is the single most effective latency weapon in system design.
When a request is served from the cache without hitting the origin, that
is a **cache hit**. When the cache does not hold the data, it is a
**cache miss**, and the request goes to the slower origin layer.

> A **cache hit** means the request was served from the cache without
> hitting the origin.

## Strategies

**Cache-aside** lets the application check the cache first and load from
the database on a miss, writing the result back to the cache.
**Write-through** updates both the cache and the database at once, so the
cache is always fresh at the cost of slower writes.

## Eviction

When the cache is full something must go. **LRU** (least recently used)
evicts the entry that has not been touched for the longest time, and it is
the usual default. Alternatives are FIFO, random eviction, and TTL-based
expiry when freshness matters more than access patterns.
