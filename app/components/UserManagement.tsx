import { Edit2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  UserManagementService,
  type CreateUserRequest,
  type Role,
  type User,
} from '../services/userManagement';

interface UserManagementProps {
  companyId: string;
  isAdmin?: boolean; // For super admin view
}

export default function UserManagement({
  companyId,
  isAdmin = false,
}: Readonly<UserManagementProps>) {
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Create user form state
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    location: '',
    role: '',
  });

  // Custom confirmation function
  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const hideConfirmation = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {},
    });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load users
      const usersData = await UserManagementService.getCompanyUsers(companyId);
      console.log('Loaded users data:', usersData);
      console.log('First user role:', usersData[0]?.role);

      // Load roles - use company roles for company admins, global roles for super admins
      const rolesData = isAdmin
        ? await UserManagementService.getAllRoles()
        : await UserManagementService.getCompanyRoles(companyId);

      setCompanyUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [companyId, isAdmin]);

  // Load users and roles on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await UserManagementService.createCompanyUser(companyId, createForm);
      setShowCreateForm(false);
      setCreateForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        jobTitle: '',
        department: '',
        location: '',
        role: '',
      });
      await loadData(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleUpdateUserRole = async (roleId: string) => {
    if (!selectedUser) return;

    try {
      setError(null);
      await UserManagementService.updateCompanyUserRole(
        companyId,
        selectedUser.id,
        { role: roleId }
      );
      setShowRoleModal(false);
      setSelectedUser(null);
      await loadData(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleDeleteUser = async (user: User) => {
    showConfirmation(
      'Delete User',
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      async () => {
        try {
          setError(null);
          await UserManagementService.deleteCompanyUser(companyId, user.id);
          await loadData(); // Refresh the list
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to delete user'
          );
        }
        hideConfirmation();
      }
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-lg'>Loading users...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>
          {isAdmin ? 'All Users' : 'Company Users'}
        </h2>
        {!isAdmin && (
          <button
            onClick={() => setShowCreateForm(true)}
            type='button'
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
          >
            Add User
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                User
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Role
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {companyUsers?.map(user => (
              <tr key={user.id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                    {user.phoneNumber && (
                      <div className='text-xs text-gray-400'>
                        📞 {user.phoneNumber}
                      </div>
                    )}
                    {user.jobTitle && (
                      <div className='text-xs text-gray-400'>
                        {user.jobTitle}
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {user.role?.name ?? 'No role assigned'}
                  </div>
                  {user.role?.description && (
                    <div className='text-xs text-gray-500'>
                      {user.role.description}
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                  {!user.isEmailVerified && (
                    <span className='ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                      Email Unverified
                    </span>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                  {!isAdmin && (
                    <>
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className='inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors'
                        title='Edit Role'
                      >
                        <Edit2 className='w-4 h-4 mr-1' />
                        Edit Role
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDeleteUser(user)}
                        className='inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors'
                        title='Delete User'
                      >
                        <Trash2 className='w-4 h-4 mr-1' />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {companyUsers.length === 0 && (
          <div className='text-center py-8 text-gray-500'>No users found.</div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4'>Add New User</h3>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <form onSubmit={handleCreateUser} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Email *
                </label>
                <input
                  id='email'
                  type='email'
                  required
                  value={createForm.email}
                  onChange={e =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Password *
                </label>
                <input
                  id='password'
                  type='password'
                  required
                  value={createForm.password}
                  onChange={e =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    First Name *
                  </label>
                  <input
                    id='firstName'
                    type='text'
                    required
                    value={createForm.firstName}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        firstName: e.target.value,
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Last Name *
                  </label>
                  <input
                    id='lastName'
                    type='text'
                    required
                    value={createForm.lastName}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        lastName: e.target.value,
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='jobTitle'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Job Title
                </label>
                <input
                  id='jobTitle'
                  type='text'
                  value={createForm.jobTitle}
                  onChange={e =>
                    setCreateForm({ ...createForm, jobTitle: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                />
              </div>
              <div>
                <label
                  htmlFor='phoneNumber'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Phone Number
                </label>
                <input
                  id='phoneNumber'
                  type='tel'
                  value={createForm.phoneNumber}
                  onChange={e =>
                    setCreateForm({
                      ...createForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  placeholder='e.g., +1234567890'
                />
              </div>
              <div>
                <label
                  htmlFor='role'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Role
                </label>
                <select
                  id='role'
                  value={createForm.role}
                  onChange={e =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                >
                  <option value=''>Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowCreateForm(false)}
                  className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  Create User
                </button>
              </div>
            </form>
            {/* eslint-enable jsx-a11y/label-has-associated-control */}
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4'>
              Update Role for {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <div className='space-y-3'>
              {roles.map(role => (
                <button
                  type='button'
                  key={role.id}
                  onClick={() => handleUpdateUserRole(role.id)}
                  className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                >
                  <div className='font-medium'>{role.name}</div>
                  {role.description && (
                    <div className='text-sm text-gray-500'>
                      {role.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className='flex justify-end pt-4'>
              <button
                type='button'
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4'>
              {confirmDialog.title}
            </h3>
            <p className='text-gray-700 mb-4'>{confirmDialog.message}</p>
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={hideConfirmation}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  confirmDialog.onConfirm();
                  hideConfirmation();
                }}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
