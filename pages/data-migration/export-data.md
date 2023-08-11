#  Export data

Memgraph allows you to export all the data from the database, or results from an executed query.

## Export database

Export database to the following file formats:
- [CYPHERL using Memgraph Lab](/data-visualization/user-manual#import--export)
- [JSON using the `export_util.json` procedure](/advanced-algorithms/available-algorithms/export_util) from MAGE - graph algorithms and modules library.

You can also export data to Elasticsearch and enable continuous data
synchronization using the [`elasticsearch_synchronization` query
module](/advanced-algorithms/available-algorithms/elasticsearch_synchronization)
available in MAGE - graph algorithms and modules library. 

## Export query results

Query results can be exported to a CSV, TSV and JSON file [using Memgraph Lab](/data-visualization/user-manual#data-results).

To export query results from Memgraph Lab: 
1. Run a query or select results you want to export.
2. Click Export results and choose CSV.
3. Save the file locally.

The **Copy all** command will copy the results into clipboard in one the
available formats (CSV, TSV and JSON).

Results can also be exported to a CSV file using the [`export_util.csv_query()`
procedure](/advanced-algorithms/available-algorithms/export_util#csv_queryquery-file_path-stream)
from MAGE - graph algorithms and modules library.

## Where to next?

Now that you exported data, [import](/data-migration) it back into a new
Memgraph instance.