import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: 'pcsk_6fyasn_9dtNYyaySJX6DHY3z79pkgUkdid5TQrzKvjNeZFcTXeCdfmCLmNKNNzYHM8Z36H'
});

const index = pc.index(
  'testing',
  'https://testing-io05foq.svc.aped-4627-b74a.pinecone.io'
);

await index.namespace('example-namespace').update({
  id: 'vec4',
  metadata: {
    category: 'mathematically',
    quarter: 'Q4',
    text: 'AAPL may consider healthcare integrations in Q4 to compete with tech rivals entering the consumer wellness space.'
  }
});

console.log('vec4 metadata updated.');
