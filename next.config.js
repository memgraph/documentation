const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  defaultShowCopyCode: true
})

module.exports = withNextra({
	trailingSlash: false,
	basePath: '/docs',
	assetPrefix: '/docs',
  async redirects() {
    return [
      {
        source: '/cypher-manual/graph-algorithms',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/mage',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/mage/algorithms',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/mage/query-modules/available-queries',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/available-query-modules',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/graph-classification-algorithm',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/betweenness-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/betweenness-centrality',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality',
        permanent: true
      },
      {
        source: '/mage/algorithms/dynamic-graph-analytics/betweenness-centrality-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/betweenness-centrality-online',
        destination: '/advanced-algorithms/available-algorithms/betweenness_centrality_online',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/biconnected-components-algorithm',
        destination: '/advanced-algorithms/available-algorithms/biconnected_components',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/biconnected-components',
        destination: '/advanced-algorithms/available-algorithms/biconnected_components',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/bipartite-matching-algorithm',
        destination: '/advanced-algorithms/available-algorithms/bipartite_matching',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/bipartite-matching',
        destination: '/advanced-algorithms/available-algorithms/bipartite_matching',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/bridges-algorithm',
        destination: '/advanced-algorithms/available-algorithms/bridges',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/bridges',
        destination: '/advanced-algorithms/available-algorithms/bridges',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/collections',
        destination: '/advanced-algorithms/available-algorithms/collections',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/community-detection-algorithm',
        destination: '/advanced-algorithms/available-algorithms/community_detection',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/community-detection',
        destination: '/advanced-algorithms/available-algorithms/community_detection',
        permanent: true
      },
      {
        source: '/mage/algorithms/dynamic-graph-analytics/community-detection-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/community_detection_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/community-detection-online',
        destination: '/advanced-algorithms/available-algorithms/community_detection_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/conditional-execution',
        destination: '/advanced-algorithms/available-algorithms/conditional_execution',
        permanent: true
      },
      {
        source: '/mage/query-modules/cuda/cugraph',
        destination: '/advanced-algorithms/available-algorithms/cugraph',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/cycle-detection-algorithm',
        destination: '/advanced-algorithms/available-algorithms/cycles',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/cycles',
        destination: '/advanced-algorithms/available-algorithms/cycles',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/degree-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/degree_centrality',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/degree-centrality',
        destination: '/advanced-algorithms/available-algorithms/degree_centrality',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/distance-calculator',
        destination: '/advanced-algorithms/available-algorithms/distance_calculator',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/elasticsearch-synchronization',
        destination: '/advanced-algorithms/available-algorithms/elasticsearch_synchronization',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/export-util',
        destination: '/advanced-algorithms/available-algorithms/export_util',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/gnn-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/link-prediction-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/link-prediction-with-gnn',
        destination: '/advanced-algorithms/available-algorithms/gnn_link_prediction',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/node-classification-algorithm',
        destination: '/advanced-algorithms/available-algorithms/gnn_node_classification',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/node-classification-with-gnn',
        destination: '/advanced-algorithms/available-algorithms/gnn_node_classification',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/graph-analyzer',
        destination: '/advanced-algorithms/available-algorithms/graph_analyzer',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/graph-coloring-algorithm',
        destination: '/advanced-algorithms/available-algorithms/graph_coloring',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/graph-coloring',
        destination: '/advanced-algorithms/available-algorithms/graph_coloring',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/graph-util',
        destination: '/advanced-algorithms/available-algorithms/graph_util',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/igraphalg',
        destination: '/advanced-algorithms/available-algorithms/igraphalg',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/import-util',
        destination: '/advanced-algorithms/available-algorithms/import_util',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/json-util',
        destination: '/advanced-algorithms/available-algorithms/json_util',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/k-means-clustering-algorithm',
        destination: '/advanced-algorithms/available-algorithms/kmeans_clustering',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/katz-centrality-algorithm',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/katz-centrality',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality',
        permanent: true
      },
      {
        source: '/mage/algorithms/dynamic-graph-analytics/katz-centrality-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/katz-centrality-online',
        destination: '/advanced-algorithms/available-algorithms/katz_centrality_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/kmeans',
        destination: '/advanced-algorithms/available-algorithms/kmeans_clustering',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/llm-util',
        destination: '/advanced-algorithms/available-algorithms/llm_util',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/map',
        destination: '/advanced-algorithms/available-algorithms/map',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/maximum-flow-algorithm',
        destination: '/advanced-algorithms/available-algorithms/max_flow',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/max-flow',
        destination: '/advanced-algorithms/available-algorithms/max_flow',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/meta-util',
        destination: '/advanced-algorithms/available-algorithms/meta_util',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/migrate',
        destination: '/advanced-algorithms/available-algorithms/migrate',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/node-similarity-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node_similarity',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/node-similarity',
        destination: '/advanced-algorithms/available-algorithms/node_similarity',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/graph-clustering-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/node2vec-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/node2vec',
        destination: '/advanced-algorithms/available-algorithms/node2vec',
        permanent: true
      },
      {
        source: '/mage/algorithms/dynamic-graph-analytics/node2vec-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/node2vec_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/node2vec-online',
        destination: '/advanced-algorithms/available-algorithms/node2vec_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/nxalg',
        destination: '/advanced-algorithms/available-algorithms/nxalg',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/pagerank-algorithm',
        destination: '/advanced-algorithms/available-algorithms/pagerank',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/pagerank',
        destination: '/advanced-algorithms/available-algorithms/pagerank',
        permanent: true
      },
      {
        source: '/mage/algorithms/dynamic-graph-analytics/pagerank-online-algorithm',
        destination: '/advanced-algorithms/available-algorithms/pagerank_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/pagerank-online',
        destination: '/advanced-algorithms/available-algorithms/pagerank_online',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/periodic',
        destination: '/advanced-algorithms/available-algorithms/periodic',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/set-cover',
        destination: '/advanced-algorithms/available-algorithms/set_cover',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/set-property',
        destination: '/advanced-algorithms/available-algorithms/set_property',
        permanent: true
      },
      {
        source: '/mage/algorithms/machine-learning-graph-analytics/temporal-graph-networks',
        destination: '/advanced-algorithms/available-algorithms/tgn',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/temporal-graph-networks',
        destination: '/advanced-algorithms/available-algorithms/tgn',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/tsp',
        destination: '/advanced-algorithms/available-algorithms/tsp',
        permanent: true
      },
      {
        source: '/mage/algorithms/traditional-graph-analytics/union-find-algorithm',
        destination: '/advanced-algorithms/available-algorithms/union_find',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/union-find',
        destination: '/advanced-algorithms/available-algorithms/union_find',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/uuid-generator',
        destination: '/advanced-algorithms/available-algorithms/uuid_generator',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/vrp',
        destination: '/advanced-algorithms/available-algorithms/vrp',
        permanent: true
      },
      {
        source: '/mage/query-modules/cpp/weakly-connected-components',
        destination: '/advanced-algorithms/available-algorithms/weakly_connected_components',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/built-in-graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/mage/installation',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/mage/installation/cugraph',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/mage/installation/docker-build',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/mage/installation/docker-hub',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/mage/installation/source',
        destination: '/advanced-algorithms/install-mage',
        permanent: true
      },
      {
        source: '/mage/how-to-guides/run-a-query-module',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/mage/how-to-guides/run-a-subgraph-module',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/mage/usage/calling-procedures',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/networkx',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/social-network-analysis',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/understanding-music-with-modules',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/c-sharp',
        destination: '/client-libraries/c-sharp',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/go',
        destination: '/client-libraries/go',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/java',
        destination: '/client-libraries/java',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/javascript',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/websocket',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/nodejs',
        destination: '/client-libraries/nodejs',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/php',
        destination: '/client-libraries/php',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/python',
        destination: '/client-libraries/python',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/drivers/rust',
        destination: '/client-libraries/rust',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/audit-log',
        destination: '/configuration/audit-log',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/auth-module',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/config-logs',
        destination: '/configuration/configuration-settings',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/configuration',
        destination: '/configuration/configuration-settings',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/create-backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/enterprise-features',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/enabling-enterprise',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/enterprise-features',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/runtime-settings',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/exposing-system-metrics',
        destination: '/configuration/monitoring-server',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/manage-users-using-ldap',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/ldap-security',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/metadata',
        destination: '/configuration/metadata',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/monitoring-server',
        destination: '/configuration/monitoring-server',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/multi-tenancy',
        destination: '/configuration/multi-tenancy',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/manage-label-based-access-control',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/manage-user-privileges',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/security',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/users',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/server-stats',
        destination: '/configuration/server-stats',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/encryption',
        destination: '/configuration/ssl-encryption',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/encryption',
        destination: '/configuration/ssl-encryption',
        permanent: true
      },
      {
        source: '/cypher-manual/query-modules',
        destination: '/custom-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/implement-custom-query-modules/overview',
        destination: '/custom-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/mage/contributing',
        destination: '/custom-query-modules/contributing',
        permanent: true
      },
      {
        source: '/mage/how-to-guides/create-a-new-module-cpp',
        destination: '/custom-query-modules/cpp',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/cpp-api',
        destination: '/custom-query-modules/cpp/cpp-api',
        permanent: true
      },
      {
        source: '/mage/usage/loading-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/load-call-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/module-file-utilities',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/mage/how-to-guides/create-a-new-module-python',
        destination: '/custom-query-modules/python',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/managing-python-environment',
        destination: '/custom-query-modules/python',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/mock-python-api',
        destination: '/custom-query-modules/python/mock-python-api',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/implement-custom-query-module-in-python',
        destination: '/custom-query-modules/python/implement-custom-query-module-in-python',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/python-api',
        destination: '/custom-query-modules/python/python-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/implement-custom-query-modules/custom-query-module-example',
        destination: '/custom-query-modules/python/python-example',
        permanent: true
      },
      {
        source: '/memgraph/import-data',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/import-data/files/overview',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/load-csv',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/import-data/load-csv-clause',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/migrate-from-neo4j',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/migrate-relational-database',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/import-data/files/cypherl',
        destination: '/data-migration/cypherl',
        permanent: true
      },
      {
        source: '/memgraph/export-data',
        destination: '/data-migration/export-data',
        permanent: true
      },
      {
        source: '/memgraph/import-data/files/load-json',
        destination: '/data-migration/json',
        permanent: true
      },
      {
        source: '/memgraph/import-data/migrate/mysql',
        destination: '/data-migration/migrate-from-rdbms',
        permanent: true
      },
      {
        source: '/memgraph/import-data/migrate/postgresql',
        destination: '/data-migration/migrate-from-rdbms',
        permanent: true
      },
      {
        source: '/memgraph/import-data/data-streams/overview',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/graph-stream-processing-with-kafka',
        destination: '/data-streams/graph-stream-processing-with-kafka',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/manage-streams-lab',
        destination: '/data-streams/manage-streams-lab',
        permanent: true
      },
      {
        source: '/memgraph/import-data/data-streams/manage-streams-lab',
        destination: '/data-streams/manage-streams-lab',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/manage-streams',
        destination: '/data-streams/manage-streams-query',
        permanent: true
      },
      {
        source: '/memgraph/import-data/data-streams/manage-streams',
        destination: '/data-streams/manage-streams-query',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/streams/transformation-modules',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/streams/transformation-modules/api/c-api',
        destination: '/data-streams/transformation-modules/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/streams/transformation-modules/api/python-api',
        destination: '/data-streams/transformation-modules/python-api',
        permanent: true
      },
      {
        source: '/memgraph-lab',
        destination: '/data-visualization/',
        permanent: true
      },
      {
        source: '/memgraph-lab/graph-style-script-language',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/reference-guide',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-colors',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-functions',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-variables',
        destination: '/data-visualization/graph-style-script/built-in-elements',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-edgestyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-nodestyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-viewstyle-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/gss-viewstyle-map-directive',
        destination: '/data-visualization/graph-style-script/directive-properties',
        permanent: true
      },
      {
        source: '/memgraph-lab/connect-to-memgraph',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph-lab/installation',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph-lab/installation/linux',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph-lab/installation/macos',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph-lab/installation/windows',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/font-awesome-for-node-images',
        destination: '/data-visualization/style-your-graphs-in-memgraph-lab',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/style-your-graphs-in-memgraph-lab',
        destination: '/data-visualization/style-your-graphs-in-memgraph-lab',
        permanent: true
      },
      {
        source: '/memgraph-lab/user-manual',
        destination: '/data-visualization/user-manual',
        permanent: true
      },
      {
        source: '/cypher-manual/working-with-memgraph',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide',
        destination: '/fundamentals',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/constraints/existence-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/constraints/uniqueness-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/indexes',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood/storage',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/storage-modes',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/memory-control',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood/telemetry',
        destination: '/fundamentals/telemetry',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/transactions',
        destination: '/fundamentals/transactions',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/set-up-triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/memgraph',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/mgconsole',
        destination: '/getting-started/cli',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/data-types',
        destination: '/fundamentals/data-types',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/first-steps-with-memgraph',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-debian',
        destination: '/getting-started/install-memgraph/debian',
        permanent: true
      },
      {
        source: '/memgraph/installation/direct-download-links',
        destination: '/getting-started/install-memgraph/direct-download-links',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/work-with-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-db-on-linux-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-db-on-macos-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-db-on-windows-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-linux-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-macos-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-windows-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/deployment/docker',
        destination: '/getting-started/install-memgraph/docker-compose',
        permanent: true
      },
      {
        source: '/memgraph/linux-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/ubuntu',
        permanent: true
      },
      {
        source: '/memgraph/macos-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/windows-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/deployment/kubernetes',
        destination: '/getting-started/install-memgraph/kubernetes',
        permanent: true
      },
      {
        source: '/memgraph-cloud',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/memgraph-cloud/cloud-account',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/memgraph-cloud/cloud-connect',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/memgraph-cloud/cloud-projects',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/memgraph-cloud/payment',
        destination: '/getting-started/install-memgraph/memgraph-cloud',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-from-rpm',
        destination: '/getting-started/install-memgraph/rpm-package',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-ubuntu',
        destination: '/getting-started/install-memgraph/ubuntu',
        permanent: true
      },
      {
        source: '/memgraph/install-memgraph-on-windows-wsl',
        destination: '/getting-started/install-memgraph/wsl',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/install-memgraph-windows-10',
        destination: '/getting-started/install-memgraph/wsl',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/graph-modeling',
        destination: '/fundamentals/graph-modeling',
        permanent: true
      },
      {
        source: '/errors',
        destination: '/help-center/errors/overview',
        permanent: true
      },
      {
        source: '/errors/memgraph/auth',
        destination: '/help-center/errors/auth',
        permanent: true
      },
      {
        source: '/errors/memgraph/durability',
        destination: '/help-center/errors/durability',
        permanent: true
      },
      {
        source: '/errors/memgraph/memory',
        destination: '/help-center/errors/memory',
        permanent: true
      },
      {
        source: '/errors/memgraph/modules',
        destination: '/help-center/errors/modules',
        permanent: true
      },
      {
        source: '/errors/memgraph/ports',
        destination: '/help-center/errors/ports',
        permanent: true
      },
      {
        source: '/errors/memgraph/python-modules',
        destination: '/help-center/errors/python-modules',
        permanent: true
      },
      {
        source: '/errors/memgraph/replication',
        destination: '/help-center/errors/replication',
        permanent: true
      },
      {
        source: '/errors/memgraph/snapshots',
        destination: '/help-center/errors/snapshots',
        permanent: true
      },
      {
        source: '/errors/memgraph/socket',
        destination: '/help-center/errors/socket',
        permanent: true
      },
      {
        source: '/errors/memgraph/ssl',
        destination: '/help-center/errors/ssl',
        permanent: true
      },
      {
        source: '/errors/memgraph/unknown',
        destination: '/help-center/errors/unknown',
        permanent: true
      },
      {
        source: '/help-center/faq/cloud',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/help-center/faq/mage',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/help-center/faq/memgraph',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/help-center/faq/memgraph-lab',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/cypher-manual',
        destination: '/querying',
        permanent: true
      },
      {
        source: '/cypher-manual/cypher-query-language',
        destination: '/querying',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses',
        destination: '/querying/clauses',
        permanent: true
      },
      {
        source: '/cypher-manual/extension-clauses',
        destination: '/querying/clauses',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/call',
        destination: '/querying/clauses/call',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/create',
        destination: '/querying/clauses/create',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/delete',
        destination: '/querying/clauses/delete',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/explain',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/match',
        destination: '/querying/clauses/match',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/merge',
        destination: '/querying/clauses/merge',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/optional-match',
        destination: '/querying/clauses/optional-match',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/profile',
        destination: '/querying/clauses/profile',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/remove',
        destination: '/querying/clauses/remove',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/return',
        destination: '/querying/clauses/return',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/set',
        destination: '/querying/clauses/set',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/union',
        destination: '/querying/clauses/union',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/unwind',
        destination: '/querying/clauses/unwind',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/where',
        destination: '/querying/clauses/where',
        permanent: true
      },
      {
        source: '/cypher-manual/clauses/with',
        destination: '/querying/clauses/with',
        permanent: true
      },
      {
        source: '/cypher-manual/connecting-nodes',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/cypher-manual/import-data',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/cypher-manual/differences',
        destination: '/querying/differences-in-cypher-implementations',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/exploring-datasets',
        destination: '/querying/exploring-datasets',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/analyzing-ted-talks',
        destination: '/querying/exploring-datasets/analyzing-ted-talks',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/backpacking-through-europe',
        destination: '/querying/exploring-datasets/backpacking-through-europe',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/exploring-the-european-road-network',
        destination: '/querying/exploring-datasets/exploring-the-european-road-network',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/football-transfers',
        destination: '/querying/exploring-datasets/football-transfers',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/got-deaths',
        destination: '/querying/exploring-datasets/got-deaths',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/graphing-the-premier-league',
        destination: '/querying/exploring-datasets/graphing-the-premier-league',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/marvel-universe',
        destination: '/querying/exploring-datasets/marvel-universe',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/movie-recommendation',
        destination: '/querying/exploring-datasets/movie-recommendation',
        permanent: true
      },
      {
        source: '/cypher-manual/other-features',
        destination: '/querying/expressions',
        permanent: true
      },
      {
        source: '/cypher-manual/functions',
        destination: '/querying/functions',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/analyze-graph',
        destination: '/fundamentals/indexes#analyze-graph',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/inspecting-queries',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/profiling-queries',
        destination: '/querying/best-practices#profiling-queries',
        permanent: true
      },
      {
        source: '/cypher-manual/deleting-nodes-and-relationships',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/cypher-manual/reading-existing-data',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/cypher-manual/updating-nodes-and-relationships',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/mage/changelog',
        destination: '/release-notes',
        permanent: true
      },
      {
        source: '/memgraph-lab/changelog',
        destination: '/release-notes',
        permanent: true
      },
      {
        source: '/memgraph/changelog',
        destination: '/release-notes',
        permanent: true
      },
      //START Redirects that have no content in new structure
      {
        source: '/connect-to-memgraph',
        destination: '/',
        permanent: true
      },
      {
        source: '/cypher-manual/what-are-graph-databases',
        destination: '/',
        permanent: true
      },
      {
        source: '/mage/how-to-guides/run-a-query-module',
        destination: '/advanced-algorithms/run-algorithms',
        permanent: true
      },
      {
        source: '/mage/use-cases/bioinformatics',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/computer-security',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/drug-discovery',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/finance',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/knowledge-graph',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/power-grids',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/process-engineering',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/retail',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/social-media',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/telecommunication',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/use-cases/transportation',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/use-init-flags',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/tutorials',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood',
        destination: '/',
        permanent: true
      },
      //END Redirects that have no content in new structure
      //START Old Docusarus redirects
      {
        source: '/memgraph/tutorials-overview',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/querying/querying',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/querying',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/connection-methods',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/tutorials/tutorials',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/concepts',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/query-modules',
        destination: '/advanced-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/use-query-modules-provided-by-memgraph',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/query-modules/built-in-query-modules',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/distance-calculator',
        destination: '/advanced-algorithms/available-algorithms/distance_calculator',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/concepts-overview/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/concepts/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/under-the-hood/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/understanding-music-with-modules',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/social-network-analysis',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/networkx',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/networkx/graph-analyzer',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/networkx/wcc',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/networkx/nxalg',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/networkx',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/networkx/graph-analyzer',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/networkx/nxalg',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/networkx',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/query-memgraph-programmatically',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/drivers',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/c-sharp',
        destination: '/client-libraries/c-sharp',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/c-sharp',
        destination: '/client-libraries/c-sharp',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/go',
        destination: '/client-libraries/go',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/go',
        destination: '/client-libraries/go',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/java',
        destination: '/client-libraries/java',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/java',
        destination: '/client-libraries/java',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/javascript',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/javascript',
        destination: '/client-libraries/javascript',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/nodejs',
        destination: '/client-libraries/nodejs',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/php',
        destination: '/client-libraries/php',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/php',
        destination: '/client-libraries/php',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/python',
        destination: '/client-libraries/python',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/python',
        destination: '/client-libraries/python',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/connecting-applications/rust',
        destination: '/client-libraries/rust',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/building-applications/rust',
        destination: '/client-libraries/rust',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/audit-log',
        destination: '/configuration/audit-log',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/auth-module',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/configuration',
        destination: '/configuration/configuration-settings',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/manage-users-using-ldap',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/ldap-security',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/manage-users-using-ldap',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/concepts-overview/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/concepts/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/manage-user-privileges',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/security',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/manage-user-privileges',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/query-modules/c-api',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/c-api',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_date_parameters',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_duration_parameters',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_edge_id',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_edge_type',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_label',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_local_date_time_parameters',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_local_time_parameters',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_property',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/api/c-api/classes/mgp_vertex_id',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/load-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/call-query-module-procedures',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/implement-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/use-and-implement-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/query-modules/load-call-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/query-modules/implement-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/query-modules/implement-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/query-modules/python-api',
        destination: '/custom-query-modules/python/python-api',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/query-modules/python-api',
        destination: '/custom-query-modules/python/python-api',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/import-data',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/import-data',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/import-data/csv/overview',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/import-data/overview',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/import-data/csv/csv-import-tool',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/import-data/csv-import-tool',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/import-data/csv-import-tool',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/import-data/csv/load-csv-clause',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/import-data/load-csv-clause',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/import-data/cypherl',
        destination: '/data-migration/cypherl',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/import-data/cypherl',
        destination: '/data-migration/cypherl',
        permanent: true
      },
      {
        source: '/memgraph/import-data/load-json',
        destination: '/data-migration/json',
        permanent: true
      },
      {
        source: '/memgraph/import-data/json/load-json',
        destination: '/data-migration/json',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/kafka-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/kafka/kafka-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/kafka/kafka-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/pulsar/pulsar-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/pulsar/pulsar-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/import-data/kafka',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/import-data/kafka/overview',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/kafka/connect-to-stream-from-lab',
        destination: '/data-streams/manage-streams-lab',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/kafka/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/kafka/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/streams/pulsar/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/pulsar/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/streams/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/import-data/kafka/json',
        destination: '/data-streams/transformation-modules/python-api',
        permanent: true
      },
      {
        source: '/memgraph/import-data/kafka/avro',
        destination: '/data-streams/transformation-modules/python-api',
        permanent: true
      },
      {
        source: '/memgraph/import-data/kafka/protobuf',
        destination: '/data-streams/transformation-modules/python-api',
        permanent: true
      },
      {
        source: '/memgraph-lab/style_script',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/memgraph-lab/style-script/quick-start',
        destination: '/data-visualization/graph-style-script',
        permanent: true
      },
      {
        source: '/memgraph-lab/how_to_install_memgraph_lab_on_macos',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph-lab/installation/overview',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/enforce-constraints',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/constraints/existence-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/constraints/uniqueness-constraint',
        destination: '/fundamentals/constraints',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/concepts-overview/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/concepts/indexing',
        destination: '/fundamentals/indexes',
        permanent: true
      },
      {
        source: '/memgraph/concepts-overview/storage',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/concepts/storage',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/memory-control',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/memory-control',
        destination: '/fundamentals/storage-memory-usage',
        permanent: true
      },
      {
        source: '/memgraph/concepts/telemetry',
        destination: '/fundamentals/telemetry',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/isolation-levels',
        destination: '/fundamentals/transactions',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/triggers',
        destination: '/fundamentals/triggers',
        permanent: true
      },
      {
        source: '/memgraph/introduction',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/overview',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/quick-start',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/getting-started',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/connect-to-memgraph/methods/mgconsole',
        destination: '/getting-started/cli',
        permanent: true
      },
      {
        source: '/memgraph/reference-guide/temporal-types',
        destination: '/fundamentals/data-types',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/installation/docker-installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/installation/debian-installation',
        destination: '/getting-started/install-memgraph/debian',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/work-with-docker',
        destination: '/getting-started/first-steps-with-docker',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/work-with-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/how-to-work-with-docker',
        destination: '/getting-started/first-steps-with-docker',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/installation/rpm-installation',
        destination: '/getting-started/install-memgraph/rpm-package',
        permanent: true
      },
      {
        source: '/memgraph/getting-started/installation/wsl-installation',
        destination: '/getting-started/install-memgraph/wsl',
        permanent: true
      },
      {
        source: '/memgraph/getting-help/getting-help',
        destination: '/help-center/',
        permanent: true
      },
      {
        source: '/mage/getting-help',
        destination: '/help-center/',
        permanent: true
      },
      {
        source: '/memgraph/faq',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/memgraph/getting-help/faq',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/mage/faq',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher',
        destination: '/querying',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses',
        destination: '/querying/clauses',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/create',
        destination: '/querying/clauses/create',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/delete',
        destination: '/querying/clauses/delete',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/match',
        destination: '/querying/clauses/match',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/merge',
        destination: '/querying/clauses/merge',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/optional-match',
        destination: '/querying/clauses/optional-match',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/remove',
        destination: '/querying/clauses/remove',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/return',
        destination: '/querying/clauses/return',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/set',
        destination: '/querying/clauses/set',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/union',
        destination: '/querying/clauses/union',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/unwind',
        destination: '/querying/clauses/unwind',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/where',
        destination: '/querying/clauses/where',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/clauses/with',
        destination: '/querying/clauses/with',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/writing-new-data',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/reading-and-writing',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/cypher-manual/writing-new-data',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/cypher-manual/reading-and-writing',
        destination: '/querying/create-graph-objects',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/differences',
        destination: '/querying/differences-in-cypher-implementations',
        permanent: true
      },
      {
        source: '/cypher-manual/differences/patterns-in-expressions',
        destination: '/querying/differences-in-cypher-implementations',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/analyzing-ted-talks',
        destination: '/querying/exploring-datasets/analyzing-ted-talks',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/backpacking-through-europe',
        destination: '/querying/exploring-datasets/backpacking-through-europe',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/exploring-the-european-road-network',
        destination: '/querying/exploring-datasets/exploring-the-european-road-network',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/football-transfers',
        destination: '/querying/exploring-datasets/football-transfers',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/graphing-the-premier-league',
        destination: '/querying/exploring-datasets/graphing-the-premier-league',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/marvel-universe',
        destination: '/querying/exploring-datasets/marvel-universe',
        permanent: true
      },
      {
        source: '/memgraph/tutorials-overview/movie-recommendation',
        destination: '/querying/exploring-datasets/movie-recommendation',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/other-features',
        destination: '/querying/expressions',
        permanent: true
      },
      {
        source: '/memgraph/open-cypher/functions',
        destination: '/querying/functions',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides-overview/explain-profile',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/inspecting-queries',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/memgraph/database-functionalities/profiling-queries',
        destination: '/querying/best-practices#profiling-queries',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/inspecting-queries',
        destination: '/querying/clauses/explain',
        permanent: true
      },
      {
        source: '/memgraph/how-to-guides/profiling-queries',
        destination: '/querying/best-practices#profiling-queries',
        permanent: true
      },
      {
        source: '/memgraph/reference-overview/reading-existing-data',
        destination: '/querying/read-and-modify-data',
        permanent: true
      },
      {
        source: '/mage/applications/bioinformatics-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/computer-security-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/drug-discovery-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/finance-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/knowledge-graph-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/power-grids-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/process-engineering-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/retail-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/social-media-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/telecommunication-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      {
        source: '/mage/applications/transportation-application',
        destination: 'https://memgraph.com/use-cases',
        permanent: true
      },
      //END Old Docusarus redirects
      //START GQLAlchemy redirects
      {
        source: '/gqlalchemy/how-to-guides/networkx',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/translators/import-python-graphs/',
        permanent: true
      },
      {
        source: '/gqlalchemy',
        destination: 'https://memgraph.github.io/gqlalchemy/',
        permanent: true
      },
      {
        source: '/gqlalchemy/changelog',
        destination: 'https://memgraph.github.io/gqlalchemy/changelog/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/overview/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/custom-file-system-importer',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/loaders/make-a-custom-file-system-importer/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/export-python-graphs',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/translators/export-python-graphs/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/import-python-graphs',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/translators/import-python-graphs/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/memgraph-binary-instance',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/instance-runner/memgraph-binary-instance/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/memgraph-docker-instance',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/instance-runner/memgraph-docker-instance/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/ogm',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/ogm/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/on-disk-storage',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/on-disk-storage/on-disk-storage/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/query-builder',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/query-builder/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/query-builder/graph-projection',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/query-builder/graph-projection/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/streams/manage-kafka-streams',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/streams/kafka-streams/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/streams/manage-pulsar-streams',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/streams/pulsar-streams/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/table-to-graph-importer',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/loaders/import-table-data-to-graph-database/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/triggers',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/triggers/triggers/',
        permanent: true
      },
      {
        source: '/gqlalchemy/import-data',
        destination: 'https://memgraph.github.io/gqlalchemy/import-data/',
        permanent: true
      },
      {
        source: '/gqlalchemy/installation',
        destination: 'https://memgraph.github.io/gqlalchemy/installation/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/overview/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/connection',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/connection/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/disk_storage',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/disk_storage/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/exceptions',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/exceptions/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/graph_algorithms/integrated_algorithms',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/graph_algorithms/integrated_algorithms/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/graph_algorithms/query_builder',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/graph_algorithms/query_builder/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/graph_algorithms/query_modules',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/graph_algorithms/query_modules/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/instance_runner',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/instance_runner/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/models',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/models/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/query_builders/declarative_base',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/query_builders/declarative_base/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/query_builders/memgraph_query_builder',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/query_builders/memgraph_query_builder/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/overview/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/export/graph_transporter',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/export/graph_transporter/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/export/transporter',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/export/transporter/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/importing/graph_importer',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/importing/graph_importer/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/importing/loaders',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/importing/loaders/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/translators/dgl_translator',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/translators/dgl_translator/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/translators/nx_translator',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/translators/nx_translator/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/translators/pyg_translator',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/translators/pyg_translator/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/transformations/translators/translator',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/transformations/translators/translator/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/utilities',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/utilities/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/vendors/database_client',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/vendors/database_client/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/vendors/memgraph',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/vendors/memgraph/',
        permanent: true
      },
      {
        source: '/gqlalchemy/reference/vendors/neo4j',
        destination: 'https://memgraph.github.io/gqlalchemy/reference/gqlalchemy/vendors/neo4j/',
        permanent: true
      },
      {
        source: '/gqlalchemy/under-the-hood',
        destination: 'https://memgraph.github.io/gqlalchemy/under-the-hood/overview/',
        permanent: true
      },
      {
        source: '/gqlalchemy/under-the-hood/python-graph-translators',
        destination: 'https://memgraph.github.io/gqlalchemy/under-the-hood/python-graph-translators/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/query-builder/create-nodes-relationships',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/query-builder/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/query-builder/return-results',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/query-builder/',
        permanent: true
      },
      {
        source: '/gqlalchemy/how-to-guides/ogm/map-nodes-and-relationships',
        destination: 'https://memgraph.github.io/gqlalchemy/how-to-guides/ogm/',
        permanent: true
      },
      //END GQLAlchemy redirects
      //START 404 links redirects
      {
        source: '/memgraph/latest',
        destination: '/',
        permanent: true
      },
      {
        source: '/memgraph/1.3.0/concepts/graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      },
      {
        source: '/memgraph/1.3.0/reference-guide/security',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/1.6.1/database-functionalities/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/1.6.1/macos-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/2.0.0/macos-installation-troubleshooting',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/2.0.0/reference-guide/security',
        destination: '/configuration/security',
        permanent: true
      },
      {
        source: '/memgraph/2.0.1/import-data',
        destination: '/data-migration',
        permanent: true
      },
      {
        source: '/memgraph/2.1.0/database-functionalities/streams/pulsar/pulsar-streams',
        destination: '/data-streams',
        permanent: true
      },
      {
        source: '/memgraph/2.1.1/how-to-guides/streams/pulsar/implement-transformation-module',
        destination: '/data-streams/transformation-modules',
        permanent: true
      },
      {
        source: '/memgraph/2.1.1/install-memgraph-on-linux-docker',
        destination: '/getting-started/install-memgraph/docker',
        permanent: true
      },
      {
        source: '/memgraph/2.1.1/reference-guide/query-modules/api/c-api/classes/mgp_duration_parameters',
        destination: '/custom-query-modules/c/c-api',
        permanent: true
      },
      {
        source: '/memgraph/2.10.0/reference-guide/runtime-settings',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/2.2.0/install-memgraph-on-windows-wsl',
        destination: '/getting-started/install-memgraph/wsl',
        permanent: true
      },
      {
        source: '/memgraph/2.2.1/install-memgraph-from-rpm',
        destination: '/getting-started/install-memgraph/rpm-package',
        permanent: true
      },
      {
        source: '/memgraph/2.3.0/reference-guide/query-modules/available-query-modules',
        destination: '/advanced-algorithms/available-algorithms',
        permanent: true
      },
      {
        source: '/memgraph/2.3.0/reference-guide/query-modules/implement-custom-query-modules/overview',
        destination: '/custom-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/2.3.0/tutorials/football-transfers',
        destination: '/querying/exploring-datasets/football-transfers',
        permanent: true
      },
      {
        source: '/memgraph/2.3.1/installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/memgraph/2.3.1/reference-guide/audit-log',
        destination: '/configuration/audit-log',
        permanent: true
      },
      {
        source: '/memgraph/2.4.0/import-data/load-csv-clause',
        destination: '/data-migration/csv',
        permanent: true
      },
      {
        source: '/memgraph/2.4.0/reference-guide/enabling-enterprise',
        destination: '/configuration/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/memgraph/2.4.0/reference-guide/query-modules/load-call-query-modules',
        destination: '/custom-query-modules/manage-query-modules',
        permanent: true
      },
      {
        source: '/memgraph/2.4.1/tutorials/first-steps-with-memgraph',
        destination: '/getting-started',
        permanent: true
      },
      {
        source: '/memgraph/2.4.1/tutorials/got-deaths',
        destination: '/querying/exploring-datasets/got-deaths',
        permanent: true
      },
      {
        source: '/memgraph/2.4.1/tutorials/graph-modeling',
        destination: '/fundamentals/graph-modeling',
        permanent: true
      },
      {
        source: '/memgraph/2.4.1/tutorials/understanding-music-with-modules',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/2.4.2/connect-to-memgraph/drivers',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/2.4.0/connect-to-memgraph/drivers',
        destination: '/client-libraries',
        permanent: true
      },
      {
        source: '/memgraph/2.4.2/tutorials/understanding-music-with-modules',
        destination: '/advanced-algorithms/utilize-networkx',
        permanent: true
      },
      {
        source: '/memgraph/2.5.1/connect-to-memgraph/drivers/c-sharp',
        destination: '/client-libraries/c-sharp',
        permanent: true
      },
      {
        source: '/memgraph/2.5.2/reference-guide/replication',
        destination: '/configuration/replication',
        permanent: true
      },
      {
        source: '/memgraph/2.6.0/how-to-guides/create-backup',
        destination: '/configuration/data-durability-and-backup',
        permanent: true
      },
      {
        source: '/memgraph/next/tutorials/backpacking-through-europe',
        destination: '/querying/exploring-datasets/backpacking-through-europe',
        permanent: true
      },
      {
        source: '/memgraph/1.5.0/getting-started/installation',
        destination: '/getting-started/install-memgraph',
        permanent: true
      },
      {
        source: '/mage/query-modules/python/pagerank',
        destination: '/advanced-algorithms/available-algorithms/pagerank',
        permanent: true
      },
      {
        source: '/v0.12.0/faq',
        destination: '/help-center/faq',
        permanent: true
      },
      {
        source: '/assets/images/font-awesome-locate-icon-442ffab31aeb6947abcbb224a144d7f8.png',
        destination: '/pages/data-visualization/style-your-graphs-in-memgraph-lab/font-awesome-locate-icon.png',
        permanent: true
      },
      {
        source: '/assets/images/font-awesome-node-style-c64d6fdff1db0392288d6c3e41420819.png',
        destination: '/pages/data-visualization/style-your-graphs-in-memgraph-lab/font-awesome-node-style.png',
        permanent: true
      },
      {
        source: '/assets/images/memgraph_lab_query_modules-e5619e8b4b458425c680c0ce3cefb22c.png',
        destination: '/pages/custom-query-modules/memgraph_lab_query_modules.png',
        permanent: true
      },
      {
        source: '/memgraph/next/how-to-guides/constraints/uniqueness-constraint',
        destination: '/fundamentals/constraints#uniqueness-constraint',
        permanent: true
      },
      {
        source: '/memgraph/1.5.0/getting-started/connecting-applications/python',
        destination: '/client-libraries/python',
        permanent: true
      },
      {
        source: '/memgraph-lab/how_to_install_memgraph_lab_on_macos)',
        destination: '/data-visualization/install-and-connect',
        permanent: true
      },
      {
        source: '/memgraph/2.1.0/getting-started',
        destination: '/getting-started',
        permanent: true
      },      
      //END 404 links redirects
      {
        source: '/configuration/exposing-system-metrics',
        destination: '/configuration/monitoring-server',
        permanent: true
      },       
      {
        source: '/configuration/ldap-security',
        destination: '/configuration/auth-module',
        permanent: true
      },
      {
        source: '/memgraph/next/reference-guide/exposing-system-metrics',
        destination: '/configuration/monitoring-server',
        permanent: true
      },
      {
        source: '/advanced-algorithms/available-algorithms/schema',
        destination: '/querying/functions#schema',
        permanent: true
      },       
      {
        source: '/advanced-algorithms/available-algorithms/convert',
        destination: '/querying/functions#conversion-functions',
        permanent: true
      },      
      {
        source: '/querying/functions#schema',
        destination: '/querying/schema',
        permanent: true
      },
      {
        source: '/help-center/errors/conflicting-transactions',
        destination: '/help-center/errors/transactions',
        permanent: true
      },
      {
        source: '/configuration/experimental-replication',
        destination: '/configuration/replication/experimental-replication',
        permanent: true
      },
      {
        source: '/querying/performance-optimization',
        destination: '/querying/best-practices',
        permanent: true
      },
      {
        source: '/getting-started/first-steps-with-memgraph',
        destination: '/getting-started',
        permanent: true
      },
      //START Config - Deployment redirects
      {
        source: '/configuration/audit-log',
        destination: '/database-management/logs',
        permanent: true
      },
      {
        source: '/configuration/auth-module',
        destination: '/database-management/authentication-and-authorization/auth-system-integrations',
        permanent: true
      },
      {
        source: '/configuration/configuration-settings',
        destination: '/database-management/configuration',
        permanent: true
      },
      {
        source: '/configuration/data-durability-and-backup',
        destination: '/fundamentals/data-durability',
        permanent: true
      },
      {
        source: '/configuration/enabling-memgraph-enterprise',
        destination: '/database-management/enabling-memgraph-enterprise',
        permanent: true
      },
      {
        source: '/configuration/high-availability',
        destination: '/clustering/high-availability',
        permanent: true
      },
      {
        source: '/configuration/logs',
        destination: '/database-management/logs',
        permanent: true
      },
      {
        source: '/configuration/metadata',
        destination: '/database-management/query-metadata',
        permanent: true
      },
      {
        source: '/configuration/monitoring-server',
        destination: '/database-management/monitoring',
        permanent: true
      },
      {
        source: '/configuration/multi-tenancy',
        destination: '/database-management/multi-tenancy',
        permanent: true
      },
      {
        source: '/configuration/replication',
        destination: '/clustering/replication',
        permanent: true
      },
      {
        source: '/configuration/replication/experimental-replication',
        destination: '/clustering/replication/experimental-replication',
        permanent: true
      },
      {
        source: '/configuration/security',
        destination: '/database-management/authentication-and-authorization/role-based-access-control',
        permanent: true
      },
      {
        source: '/configuration/server-stats',
        destination: '/database-management/server-stats',
        permanent: true
      },
      {
        source: '/configuration/ssl-encryption',
        destination: '/database-management/ssl-encryption',
        permanent: true
      },
      {
        source: '/configuration/text-search',
        destination: '/querying/text-search',
        permanent: true
      },
      {
        source: '/configuration/system-configuration',
        destination: '/database-management/system-configuration',
        permanent: true
      },
      //END Config - Deployment redirects
      {
        source: '/advanced-algorithms/built-in-graph-algorithms',
        destination: '/advanced-algorithms/deep-path-traversal',
        permanent: true
      }
    ];
  },
});