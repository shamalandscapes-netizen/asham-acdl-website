export const getPermissions = (role: string) => {
  const r = role?.toLowerCase();
  return {
    canManageFinances: ['super_admin', 'admin', 'accounts'].includes(r),
    isEmployee: r === 'employee',
    roleLabel: r?.replace('_', ' ')
  };
};
