# Database Design Rules

## First Normal Form:
1. Don't use row order to convey info
2. Don't mix data types within the same column
3. Must have a primary key
4. Don't have repeating groups | Convert repeating groups into composite primary keys

## Second Normal Form:
* Each non-key attribute must depend on the entire primary key. 
* Could make new tables.
* Solves deletion, updating, insertion anomalies
    
## Third Normal Form | Boyce-Codd Normal Form
* Each attribute in a table, should depend SOLELY on the key
* Solves transitive dependencies (e.g. when forgetting to update column B if column A changes)

## Fourth Normal Form
* Multivalued deps in a table must be multivalued dependencies on the key.
* Prevents forgetting to add options
*

## Fifth Normal Form
* A 4NF table, MUST NOT be describable as the logical result of joining other tables.
