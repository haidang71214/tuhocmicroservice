enum Invoice {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
  SEND = 'invoice.send',
  UPDATE_INVOICE_PAID = 'invoice.update_invoice_paid',
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
  GET_BY_USER_ID = 'user.get_by_user_id', // lookup by Keycloak userId
  UPDATE_BY_ID = 'user.update_by_id',
  DELETE_BY_ID = 'user.delete_by_id',
  GET_ALL = 'user.get_all',
}
enum KeyCloak {
  CREATE_USER = 'keycloak.create_user',
}

enum Authorizer {
  VERIFY_USER_TOKEN = 'authorizer.verify_user_token',
  LOGIN = 'login',
}
enum PdfGenerator {
  CREATE_INVOICE_PDF = 'pdf-generator.create-invoice-pdf',
  GET_INVOICE_PDF = 'pdf-generator.get-invoice-pdf',
}
enum Media {
  UPLOAD_FILE = 'media.upload-file',
}
export const TCP_REQUEST_MESSAGE = {
  Invoice,
  Product,
  KeyCloak,
  User,
  Authorizer,
  Media,
  PdfGenerator,
};

export const TCP_REQUEST_MESSSAGE = TCP_REQUEST_MESSAGE;
