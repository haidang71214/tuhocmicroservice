enum Invoice {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
}
enum Product {
  CREATE = 'product.create',
  GET_BY_ID = 'product.get_by_id',
  UPDATE_BY_ID = 'product.update_by_id',
  DELETE_BY_ID = 'product.delete_by_id',
  GET_ALL = 'product.get_all',
}

enum User {
  CREATE = 'user.create',
  GET_BY_ID = 'user.get_by_id',
  UPDATE_BY_ID = 'user.update_by_id',
  DELETE_BY_ID = 'user.delete_by_id',
  GET_ALL = 'user.get_all',
}
enum KeyCloak {
  CREATE_USER = 'keycloak.create_user',
}
export const TCP_REQUEST_MESSAGE = {
  Invoice,
  Product,
  KeyCloak,
  User,
};
