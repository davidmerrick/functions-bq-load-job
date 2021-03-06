'use strict';

const Storage = require('@google-cloud/storage');
const BigQuery = require('@google-cloud/bigquery');

// Instantiates a client
const storage = Storage();
const bigquery = new BigQuery();

/**
 * Creates a BigQuery load job to load a file from Cloud Storage and write the data into BigQuery.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.loadFile = (data, context) => {
  const datasetId = process.env.BIGQUERY_DATASET;
  const tableId = process.env.BIGQUERY_TABLE;

  const jobMetadata = {
    sourceFormat: 'NEWLINE_DELIMITED_JSON',
    writeDisposition: 'WRITE_APPEND',
    ignoreUnknownValues: true
  };

  // Loads data from a Google Cloud Storage file into the table
  bigquery
    .dataset(datasetId)
    .table(tableId)
    .load(storage.bucket(data.bucket).file(data.name), jobMetadata)
    .catch(err => {
      console.error('ERROR:', err);
    });

  console.log(`Loading from gs://${data.bucket}/${data.name} into ${datasetId}.${tableId}`);
};
