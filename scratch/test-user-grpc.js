const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../libs/interfaces/src/lib/proto/user-access/user-access.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [path.resolve(__dirname, '../libs/interfaces/src/lib/proto')],
});

const userAccessProto = grpc.loadPackageDefinition(packageDefinition).GRPC_USER_ACCESS_SERVICE;

function main() {
  const client = new userAccessProto.UserAccessService('localhost:5101', grpc.credentials.createInsecure());

  const userId = '8e68c473-8e16-45fc-80db-591920e49a48';
  console.log('Calling getByUserId with ID:', userId);

  client.getByUserId({ id: userId, processId: 'test-process-id' }, (err, response) => {
    if (err) {
      console.error('Error calling getByUserId:', err);
    } else {
      console.log('Response from getByUserId:', JSON.stringify(response, null, 2));
    }
  });
}

main();
