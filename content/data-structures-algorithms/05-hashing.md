# Hashing

A hash map turns a key into a lookup without comparing the key to
anything. That is the whole trick, and it is why so many interview
problems start with "can you do this in one pass?"

## How a hash map works

A **hash map** stores key-value pairs in an array of **bucket** slots. A
**hash function** maps the key to an index; the entry lives there, or in
a list hanging off that slot.

Lookup, insert, and delete are O(1) on average, because the hash
function computes the slot directly instead of searching. Deletion is
often O(1) too — a tombstone marks the slot as empty without moving
the cluster around it.

## Collisions and load factor

Two keys can hash to the same slot; that is a **collision**, and it is
not a bug but a fact of the design. Two standard strategies handle it:
**chaining**, where each bucket holds a list of entries, and **open
addressing**, where a collision probes for the next free slot in the
same array.

The **load factor** is the ratio of entries to buckets. Above roughly
0.7 for chaining, collisions climb and lookups slow down, so the map
**resizes** into a bigger array and rehashes everything. That rehash is
O(n), but it happens rarely enough to stay amortized.

## Sets

A **hash set** is a hash map whose values are meaningless: it answers
"have I seen this before?". That makes it the right tool for duplicate
detection, for counting occurrences, and for turning a list into a
membership test.

## What hashing is good for

The recurring pattern: if the problem asks "does this pair exist?",
"have I seen this value before?", or "how many times does this
appear?", the answer is usually a hash map or a hash set and a single
pass. Two-sum, anagrams, duplicate detection, and counting all collapse
to that shape.

> A **hash set** answers "have I seen this before?" in O(1) per
> element, which turns many duplicate and pairing problems into a
> single pass.

## Designing an LRU cache

The classic design question combines two structures: a **hash map** from
key to node, and a **doubly linked list** of the entries in recency
order. The map gives O(1) lookup, the list gives O(1) promotion to the
front and O(1) eviction of the back.

Every read and every write must move the entry to the front — that is
what "recently used" means. The whole operation stays O(1), and the
design shows up in database buffers, CDN edge caches, and OS page
caches, so it is worth being able to sketch from memory.
