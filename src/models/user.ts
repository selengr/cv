export interface UserType {
  id: number;
  name: string;
  permissions: string[];
}

export default class User {
  user?: UserType;

  constructor(user?: UserType) {
    this.user = user;
  }

  get name() {
    return this.user?.name;
  }

  canAccess(permission: string) {
    const userPermissions = this.user?.permissions ?? [];
    const permissions = permission
      .split("|")
      .filter((item) => userPermissions.includes(item));

    return permissions.length > 0;
  }
}
