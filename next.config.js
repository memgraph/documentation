const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  defaultShowCopyCode: true
})

module.exports = withNextra({
  async redirects() {
    return [
      {
        source: '/docs/cypher-manual/graph-algorithms',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/available-queries',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/available-query-modules',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/graph-classification-algorithm',
        destination: '/advanced-algorithms/available-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/betweenness-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/betweenness-centrality',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/dynamic-graph-analytics/betweenness-centrality-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/betweenness-centrality-online',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality_online',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/biconnected-components-algorithm',
        destination: '/advanced-algorithms/available-algorithms/biconnected_components',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/biconnected-components',
        destination: '/advanced-algorithms/available-algorithms/biconnected_components',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/bipartite-matching-algorithm',
        destination: '/advanced-algorithms/available-algorithms/bipartite_matching',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/bipartite-matching',
        destination: '/advanced-algorithms/available-algorithms/bipartite_matching',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/bridges-algorithm',
        destination: '/advanced-algorithms/available-algorithms/bridges',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/bridges',
        destination: '/advanced-algorithms/available-algorithms/bridges',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/collections',
        destination: '/advanced-algorithms/available-algorithms/collections',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/community-detection-algorithm',
        destination: '/advanced-algorithms/available-algorithms/community_detection',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/community-detection',
        destination: '/advanced-algorithms/available-algorithms/community_detection',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/dynamic-graph-analytics/community-detection-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/community_detection_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/community-detection-online',
        destination: '/advanced-algorithms/available-algorithms/community_detection_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/conditional-execution',
        destination: '/advanced-algorithms/available-algorithms/conditional_execution',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cuda/cugraph',
        destination: '/advanced-algorithms/available-algorithms/cugraph',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/cycle-detection-algorithm',
        destination: '/advanced-algorithms/available-algorithms/cycles',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/cycles',
        destination: '/advanced-algorithms/available-algorithms/cycles',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/degree-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/degree_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/degree-centrality',
        destination: '/advanced-algorithms/available-algorithms/degree_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/distance-calculator',
        destination: '/advanced-algorithms/available-algorithms/distance_calculator',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/elasticsearch-synchronization',
        destination: '/advanced-algorithms/available-algorithms/elasticsearch_synchronization',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/export-util',
        destination: '/advanced-algorithms/available-algorithms/export_util',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/gnn-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/link-prediction-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/link-prediction-with-gnn',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/node-classification-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_node_classification',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/node-classification-with-gnn',
        destination: '/advanced-algorithms/available-algorithms/gnn_node_classification',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/graph-analyzer',
        destination: '/advanced-algorithms/available-algorithms/graph_analyzer',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/graph-coloring-algorithm',
        destination: '/advanced-algorithms/available-algorithms/graph_coloring',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/graph-coloring',
        destination: '/advanced-algorithms/available-algorithms/graph_coloring',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/graph-util',
        destination: '/advanced-algorithms/available-algorithms/graph_util',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/igraphalg',
        destination: '/advanced-algorithms/available-algorithms/igraphalg',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/import-util',
        destination: '/advanced-algorithms/available-algorithms/import_util',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/json-util',
        destination: '/advanced-algorithms/available-algorithms/json_util',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/k-means-clustering-algorithm',
        destination: '/advanced-algorithms/available-algorithms/k_means_clustering',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/katz-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/katz-centrality',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/dynamic-graph-analytics/katz-centrality-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/katz-centrality-online',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/kmeans',
        destination: '/advanced-algorithms/available-algorithms/kmeans_clustering',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/llm-util',
        destination: '/advanced-algorithms/available-algorithms/llm_util',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/map',
        destination: '/advanced-algorithms/available-algorithms/map',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/maximum-flow-algorithm',
        destination: '/advanced-algorithms/available-algorithms/max_flow',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/max-flow',
        destination: '/advanced-algorithms/available-algorithms/max_flow',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/meta-util',
        destination: '/advanced-algorithms/available-algorithms/meta_util',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/migrate',
        destination: '/advanced-algorithms/available-algorithms/migrate',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/node-similarity-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node_similarity',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/node-similarity',
        destination: '/advanced-algorithms/available-algorithms/node_similarity',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/graph-clustering-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/node2vec-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/node2vec',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/dynamic-graph-analytics/node2vec-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/node2vec-online',
        destination: '/advanced-algorithms/available-algorithms/node2vec_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/nxalg',
        destination: '/advanced-algorithms/available-algorithms/nxalg',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/pagerank-algorithm',
        destination: '/advanced-algorithms/available-algorithms/pagerank',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/pagerank',
        destination: '/advanced-algorithms/available-algorithms/pagerank',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/dynamic-graph-analytics/pagerank-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/pagerank_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/pagerank-online',
        destination: '/advanced-algorithms/available-algorithms/pagerank_online',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/periodic',
        destination: '/advanced-algorithms/available-algorithms/periodic',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/set-cover',
        destination: '/advanced-algorithms/available-algorithms/set_cover',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/machine-learning-graph-analytics/temporal-graph-networks',
        destination: '/advanced-algorithms/available-algorithms/temporal_graph_networks',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/temporal-graph-networks',
        destination: '/advanced-algorithms/available-algorithms/temporal_graph_networks',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/tsp',
        destination: '/advanced-algorithms/available-algorithms/tsp',
        permanent: true
      },
      {
        source: '/docs/mage/algorithms/traditional-graph-analytics/union-find-algorithm',
        destination: '/advanced-algorithms/available-algorithms/union_find',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/union-find',
        destination: '/advanced-algorithms/available-algorithms/union_find',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/uuid-generator',
        destination: '/advanced-algorithms/available-algorithms/uuid_generator',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/python/vrp',
        destination: '/advanced-algorithms/available-algorithms/vrp',
        permanent: true
      },
      {
        source: '/docs/mage/query-modules/cpp/weakly-connected-components',
        destination: '/advanced-algorithms/available-algorithms/weakly_connected_components',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/built-in-graph-algorithms',
        destination: '/advanced-algorithms/built-in-graph-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/installation',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/docs/mage/installation/cugraph',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/docs/mage/installation/docker-build',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/docs/mage/installation/docker-hub',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/docs/mage/installation/source',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/docs/mage/how-to-guides/run-a-query-module',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/how-to-guides/run-a-subgraph-module',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/docs/mage/usage/calling-procedures',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/networkx',
        destination: '/advanced-algorithms/utilize-the-networkx-library',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/social-network-analysis',
        destination: '/advanced-algorithms/utilize-the-networkx-library',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/understanding-music-with-modules',
        destination: '/advanced-algorithms/utilize-the-networkx-library',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/c-sharp',
        destination: '/client-libraries/c-sharp',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/go',
        destination: '/client-libraries/go',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/java',
        destination: '/client-libraries/java',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/javascript',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/websocket',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/nodejs',
        destination: '/client-libraries/nodejs',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/php',
        destination: '/client-libraries/php',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/python',
        destination: '/client-libraries/python',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/drivers/rust',
        destination: '/client-libraries/rust',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/audit-log',
        destination: '/configuration/audit-log',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/auth-module',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/config-logs',
        destination: '/configuration/configuration-settings',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/configuration',
        destination: '/configuration/configuration-settings',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/create-backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/enterprise-features',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/enabling-enterprise',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/enterprise-features',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/runtime-settings',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/exposing-system-metrics',
        destination: '/configuration/exposing-system-metrics',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/manage-users-using-ldap',
        destination: '/configuration/ldap-security',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/ldap-security',
        destination: '/configuration/ldap-security',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/metadata',
        destination: '/configuration/metadata',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/monitoring-server',
        destination: '/configuration/monitoring-server',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/multi-tenancy',
        destination: '/configuration/multi-tenancy',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/docs/memgraph/under-the-hood/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/manage-label-based-access-control',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/manage-user-privileges',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/security',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/users',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/server-stats',
        destination: '/configuration/server-stats',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/encryption',
        destination: '/configuration/ssl-encryption',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/encryption',
        destination: '/configuration/ssl-encryption',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/query-modules',
        destination: '/custom-query-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/implement-custom-query-modules/overview',
        destination: '/custom-query-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/api/c-api',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/docs/mage/contributing',
        destination: '/custom-query-modules/contributing',
        permanent: true
      },
      {
        source: '/docs/mage/how-to-guides/create-a-new-module-cpp',
        destination: '/custom-query-modules/cpp',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/api/cpp-api',
        destination: '/custom-query-modules/cpp/cpp-api',
        permanent: true
      },
      {
        source: '/docs/mage/usage/loading-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/load-call-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/module-file-utilities',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/docs/mage/how-to-guides/create-a-new-module-python',
        destination: '/custom-query-modules/python',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/managing-python-environment',
        destination: '/custom-query-modules/python',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/api/mock-python-api',
        destination: '/custom-query-modules/python-api/mock-python-api',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/implement-custom-query-module-in-python',
        destination: '/custom-query-modules/python/implement-custom-query-module-in-python',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/api/python-api',
        destination: '/custom-query-modules/python/python-api',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/query-modules/implement-custom-query-modules/custom-query-module-example',
        destination: '/custom-query-modules/python/python-example',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/files/overview',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/load-csv',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/load-csv-clause',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/migrate-from-neo4j',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/migrate-relational-database',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/files/cypherl',
        destination: '/data-migration/cypherl',
        permanent: true
      },
      {
        source: '/docs/memgraph/export-data',
        destination: '/data-migration/export-data',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/files/load-json',
        destination: '/data-migration/json',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/migrate/mysql',
        destination: '/data-migration/sql',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/migrate/postgresql',
        destination: '/data-migration/sql',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/data-streams/overview',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/graph-stream-processing-with-kafka',
        destination: '/data-streams/graph-stream-processing-with-kafka',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/streams/manage-streams-lab',
        destination: '/data-streams/manage-streams-lab',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/data-streams/manage-streams-lab',
        destination: '/data-streams/manage-streams-lab',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/streams/manage-streams',
        destination: '/data-streams/manage-streams-query',
        permanent: true
      },
      {
        source: '/docs/memgraph/import-data/data-streams/manage-streams',
        destination: '/data-streams/manage-streams-query',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/streams/transformation-modules',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/streams/transformation-modules/api/c-api',
        destination: '/data-streams/transformation-modules/c-api',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/streams/transformation-modules/api/python-api',
        destination: '/data-streams/transformation-modules/python-api',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/',
        destination: '/data-visualization/',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/graph-style-script-language',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/reference-guide',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-colors',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-functions',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-variables',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-edgestyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-nodestyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-viewstyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/style-script/gss-viewstyle-map-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/connect-to-memgraph',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/installation',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/installation/linux',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/installation/macos',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/installation/windows',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/font-awesome-for-node-images',
        destination: '/data-visualization/style-your-graphs-in-memgraph-lab',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/style-your-graphs-in-memgraph-lab',
        destination: '/data-visualization/style-your-graphs-in-memgraph-lab',
        permanent: true
      },
      {
        source: '/docs/configuration/security',
        destination: '/data-visualization/user-manual',
        permanent: true
      },
      {
        source: '/docs/',
        destination: '/docs',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/working-with-memgraph',
        destination: '/docs',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide',
        destination: '/fundamentals',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/constraints/existence-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/constraints/uniqueness-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/indexes',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/docs/memgraph/under-the-hood/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/docs/memgraph/under-the-hood/storage',
        destination: '/fundamentals/memory-usage',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/storage-modes',
        destination: '/fundamentals/storage',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/memory-control',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/docs/memgraph/under-the-hood/telemetry',
        destination: '/fundamentals/telemetry',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/transactions',
        destination: '/fundamentals/transactions',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/set-up-triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/docs/memgraph/',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/docs/memgraph/connect-to-memgraph/mgconsole',
        destination: '/getting-started/cli',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/data-types',
        destination: '/getting-started/data-types',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/first-steps-with-memgraph',
        destination: '/getting-started/first-steps-with-memgraph',
        permanent: true
      },
      {
        source: '/docs/memgraph/installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-debian',
        destination: '/getting-started/install-memgraph/debian',
        permanent: true
      },
      {
        source: '/docs/memgraph/installation/direct-download-links',
        destination: '/getting-started/install-memgraph/direct-download-links',
        permanent: true
      },
      {
        source: '/docs/memgraph/how-to-guides/work-with-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-db-on-linux-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-db-on-macos-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-db-on-windows-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-linux-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-macos-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-windows-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/deployment/docker',
        destination: '/getting-started/install-memgraph/docker-compose',
        permanent: true
      },
      {
        source: '/docs/memgraph/linux-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/installation-troubleshooting',
        permanent: true
      },
      {
        source: '/docs/memgraph/macos-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/installation-troubleshooting',
        permanent: true
      },
      {
        source: '/docs/memgraph/windows-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/installation-troubleshooting',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/deployment/kubernetes',
        destination: '/getting-started/install-memgraph/kubernetes',
        permanent: true
      },
      {
        source: '/docs/memgraph-cloud/',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/docs/memgraph-cloud/cloud-account',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/docs/memgraph-cloud/cloud-connect',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/docs/memgraph-cloud/cloud-projects',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/docs/memgraph-cloud/payment',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-from-rpm',
        destination: '/getting-started/install-memgraph/rpm-package',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-ubuntu',
        destination: '/getting-started/install-memgraph/ubuntu',
        permanent: true
      },
      {
        source: '/docs/memgraph/install-memgraph-on-windows-wsl',
        destination: '/getting-started/install-memgraph/windows-subsystem-for-linux',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/install-memgraph-windows-10',
        destination: '/getting-started/install-memgraph/windows-subsystem-for-linux',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/graph-modeling',
        destination: '/graph-modeling',
        permanent: true
      },
      {
        source: '/docs/errors/',
        destination: '/help-center/errors',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/auth',
        destination: '/help-center/errors/memgraph/auth',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/durability',
        destination: '/help-center/errors/memgraph/durability',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/memory',
        destination: '/help-center/errors/memgraph/memory',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/modules',
        destination: '/help-center/errors/memgraph/modules',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/ports',
        destination: '/help-center/errors/memgraph/ports',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/python-modules',
        destination: '/help-center/errors/memgraph/python-modules',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/replication',
        destination: '/help-center/errors/memgraph/replication',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/snapshots',
        destination: '/help-center/errors/memgraph/snapshots',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/socket',
        destination: '/help-center/errors/memgraph/socket',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/ssl',
        destination: '/help-center/errors/memgraph/ssl',
        permanent: true
      },
      {
        source: '/docs/errors/memgraph/unknown',
        destination: '/help-center/errors/memgraph/unknown',
        permanent: true
      },
      {
        source: '/docs/help-center/faq/cloud',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/docs/help-center/faq/mage',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/docs/help-center/faq/memgraph',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/docs/help-center/faq/memgraph-lab',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/',
        destination: '/querying',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/cypher-query-language',
        destination: '/querying',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses',
        destination: '/querying/clauses',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/extension-clauses',
        destination: '/querying/clauses',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/call',
        destination: '/querying/clauses/call',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/create',
        destination: '/querying/clauses/create',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/delete',
        destination: '/querying/clauses/delete',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/explain',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/match',
        destination: '/querying/clauses/match',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/merge',
        destination: '/querying/clauses/merge',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/optional-match',
        destination: '/querying/clauses/optional-match',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/profile',
        destination: '/querying/clauses/profile',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/remove',
        destination: '/querying/clauses/remove',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/return',
        destination: '/querying/clauses/return',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/set',
        destination: '/querying/clauses/set',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/union',
        destination: '/querying/clauses/union',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/unwind',
        destination: '/querying/clauses/unwind',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/where',
        destination: '/querying/clauses/where',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/clauses/with',
        destination: '/querying/clauses/with',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/connecting-nodes',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/import-data',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/differences',
        destination: '/querying/differences-in-cypher-implementations',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/exploring-datasets',
        destination: '/querying/exploring-datasets',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/analyzing-ted-talks',
        destination: '/querying/exploring-datasets/analyzing-ted-talks',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/backpacking-through-europe',
        destination: '/querying/exploring-datasets/backpacking-through-europe',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/exploring-the-european-road-network',
        destination: '/querying/exploring-datasets/exploring-the-european-road-network',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/football-transfers',
        destination: '/querying/exploring-datasets/football-transfers',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/got-deaths',
        destination: '/querying/exploring-datasets/got-deaths',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/graphing-the-premier-league',
        destination: '/querying/exploring-datasets/graphing-the-premier-league',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/marvel-universe',
        destination: '/querying/exploring-datasets/marvel-universe',
        permanent: true
      },
      {
        source: '/docs/memgraph/tutorials/movie-recommendation',
        destination: '/querying/exploring-datasets/movie-recommendation',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/other-features',
        destination: '/querying/expressions',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/functions',
        destination: '/querying/functions',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/analyze-graph',
        destination: '/querying/performance-optimization',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/inspecting-queries',
        destination: '/querying/performance-optimization',
        permanent: true
      },
      {
        source: '/docs/memgraph/reference-guide/profiling-queries',
        destination: '/querying/performance-optimization',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/deleting-nodes-and-relationships',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/reading-existing-data',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/docs/cypher-manual/updating-nodes-and-relationships',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/docs/mage/changelog',
        destination: '/release-notes',
        permanent: true
      },
      {
        source: '/docs/memgraph-lab/changelog',
        destination: '/release-notes',
        permanent: true
      },
      {
        source: '/docs/memgraph/changelog',
        destination: '/release-notes',
        permanent: true
      }
    ];
  },
});
