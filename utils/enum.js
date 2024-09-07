const StatusUserEnum = {
    ENABLE: 'enable',
    DISABLE: 'disable'
};

const checkStatusUser = (status) => {
  return Object.values(StatusUserEnum).includes(status);
};

const RoleUserEnum = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
};

module.exports = {
  StatusUserEnum,
  RoleUserEnum,
  checkStatusUser
}