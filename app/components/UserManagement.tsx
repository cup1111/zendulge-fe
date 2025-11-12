import { Edit2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '~/contexts/AuthContext';

import { API_CONFIG } from '../config/api';
import api from '../config/axios';
import {
  UserManagementService,
  type CreateUserRequest,
  type Role,
  type UpdateUserRequest,
  type User,
} from '../services/userManagement';

interface UserManagementProps {
  companyId: string;
  excludeUserId?: string;
}

// Helper function to capitalize first letter of role names
const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Interface for operate sites (simplified version for user management)
interface OperateSite {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  members?: { id: string }[]; // Add members for user assignment
}

export default function UserManagement({
  companyId,
  excludeUserId,
}: Readonly<UserManagementProps>) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [operateSites, setOperateSites] = useState<OperateSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
    firstName: '',
    lastName: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    location: '',
    role: '',
    operateSiteIds: [],
  });

  // Edit user form state
  const [editForm, setEditForm] = useState<
    UpdateUserRequest & { operateSiteIds: string[] }
  >({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    location: '',
    role: '',
    operateSiteIds: [],
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

  // Function to fetch operate sites
  const fetchOperateSites = async (
    companyIdParam: string
  ): Promise<OperateSite[]> => {
    const response = await api.get(
      API_CONFIG.endpoints.company.operateSites(companyIdParam)
    );

    const sites = response.data.data.operateSites.map(
      (site: Record<string, unknown>) => ({
        id: site.id as string,
        name: site.name as string,
        address: site.address as string,
        isActive: site.isActive as boolean,
        members: Array.isArray(site.members)
          ? (site.members as { id: string }[])
          : [],
      })
    );

    return sites;
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load users, roles, and operate sites
      const [usersData, rolesData, sitesData] = await Promise.all([
        UserManagementService.getCompanyUsers(companyId),
        UserManagementService.getCompanyRoles(companyId),
        fetchOperateSites(companyId),
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setOperateSites(sitesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

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
        firstName: '',
        lastName: '',
        phoneNumber: '',
        jobTitle: '',
        department: '',
        location: '',
        role: '',
        operateSiteIds: [],
      });
      await loadData(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleEditUser = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    // Find all operateSites where this user is a member
    const assignedSiteIds = operateSites
      .filter(
        site =>
          Array.isArray(site.members) &&
          site.members.some(
            (member: { id: string }) => member.id === userToEdit.id
          )
      )
      .map(site => site.id);
    setEditForm({
      firstName: userToEdit.firstName ?? '',
      lastName: userToEdit.lastName ?? '',
      phoneNumber: userToEdit.phoneNumber ?? '',
      jobTitle: userToEdit.jobTitle ?? '',
      department: userToEdit.department ?? '',
      location: userToEdit.location ?? '',
      role: userToEdit.role?.id ?? '',
      operateSiteIds: assignedSiteIds,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError(null);
      await UserManagementService.updateCompanyUser(
        companyId,
        selectedUser.id,
        editForm
      );
      setShowEditModal(false);
      setSelectedUser(null);
      // Reset form
      setEditForm({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        jobTitle: '',
        department: '',
        location: '',
        role: '',
        operateSiteIds: [],
      });
      await loadData(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    showConfirmation(
      'Delete User',
      `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.`,
      async () => {
        try {
          setError(null);
          await UserManagementService.deleteCompanyUser(
            companyId,
            userToDelete.id
          );
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

  if (isLoading) {
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
        <h2 className='text-2xl font-bold'>Company Users</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          type='button'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer'
        >
          Add User
        </button>
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
            {users
              .filter(u => !excludeUserId || u.id !== excludeUserId)
              .map(companyUser => (
                <tr key={companyUser.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {companyUser.firstName} {companyUser.lastName}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {companyUser.email}
                      </div>
                      {companyUser.phoneNumber && (
                        <div className='text-xs text-gray-400'>
                          📞 {companyUser.phoneNumber}
                        </div>
                      )}
                      {companyUser.jobTitle && (
                        <div className='text-xs text-gray-400'>
                          {companyUser.jobTitle}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {companyUser.role?.name
                        ? capitalizeFirstLetter(companyUser.role.name)
                        : 'No role assigned'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        companyUser.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {companyUser.active ? 'Active' : 'Email Unverified'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                    <button
                      type='button'
                      onClick={() => handleEditUser(companyUser)}
                      className='inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer'
                      title='Edit User'
                    >
                      <Edit2 className='w-4 h-4 mr-1' />
                      Edit User
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDeleteUser(companyUser)}
                      className='inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors cursor-pointer'
                      title='Delete User'
                    >
                      <Trash2 className='w-4 h-4 mr-1' />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {users.length === 0 && (
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
                  disabled={user?.role?.slug !== 'owner'}
                >
                  <option value=''>Select a role</option>
                  {roles
                    .filter(role => {
                      if (user?.role?.slug === 'owner') {
                        return true;
                      }
                      return role.name.toLowerCase() !== 'owner';
                    })
                    .map(role => (
                      <option key={role.id} value={role.id}>
                        {capitalizeFirstLetter(role.name)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Store Access
                </label>
                <div className='space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2'>
                  {operateSites.some(site => site.isActive) ? (
                    operateSites
                      .filter(site => site.isActive)
                      .map(site => (
                        <label key={site.id} className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={
                              createForm.operateSiteIds?.includes(site.id) ??
                              false
                            }
                            onChange={e => {
                              const isChecked = e.target.checked;
                              const currentSites =
                                createForm.operateSiteIds ?? [];
                              const newSites = isChecked
                                ? [...currentSites, site.id]
                                : currentSites.filter(id => id !== site.id);
                              setCreateForm({
                                ...createForm,
                                operateSiteIds: newSites,
                              });
                            }}
                            className='mr-2'
                          />
                          <span className='text-sm'>
                            {site.name}
                            <span className='text-xs text-gray-500 ml-1'>
                              ({site.address})
                            </span>
                          </span>
                        </label>
                      ))
                  ) : (
                    <p className='text-sm text-gray-500'>
                      No active stores available
                    </p>
                  )}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Select which stores this user can access and manage
                </p>
              </div>
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowCreateForm(false)}
                  className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'
                >
                  Create User
                </button>
              </div>
            </form>
            {/* eslint-enable jsx-a11y/label-has-associated-control */}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-semibold mb-4'>
              Edit User: {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <form onSubmit={handleUpdateUser} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='editFirstName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    First Name *
                  </label>
                  <input
                    id='editFirstName'
                    type='text'
                    required
                    value={editForm.firstName}
                    onChange={e =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
                <div>
                  <label
                    htmlFor='editLastName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Last Name *
                  </label>
                  <input
                    id='editLastName'
                    type='text'
                    required
                    value={editForm.lastName}
                    onChange={e =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='editPhoneNumber'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Phone Number
                  </label>
                  <input
                    id='editPhoneNumber'
                    type='tel'
                    value={editForm.phoneNumber}
                    onChange={e =>
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
                <div>
                  <label
                    htmlFor='editJobTitle'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Job Title
                  </label>
                  <input
                    id='editJobTitle'
                    type='text'
                    value={editForm.jobTitle}
                    onChange={e =>
                      setEditForm({ ...editForm, jobTitle: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='editRole'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Role *
                </label>
                <select
                  id='editRole'
                  required
                  value={editForm.role}
                  onChange={e =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2'
                  disabled={user?.role?.slug !== 'owner'}
                >
                  <option value=''>Select a role</option>
                  {roles
                    .filter(role => {
                      if (user?.role?.slug === 'owner') {
                        return true;
                      }
                      return role.name.toLowerCase() !== 'owner';
                    })
                    .map(role => (
                      <option key={role.id} value={role.id}>
                        {capitalizeFirstLetter(role.name)}
                      </option>
                    ))}
                </select>
              </div>

              {/* Store Access Section */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Store Access
                </label>
                <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2'>
                  {operateSites.length === 0 ? (
                    <p className='text-sm text-gray-500'>
                      No operate sites available
                    </p>
                  ) : (
                    operateSites.map(site => (
                      <label
                        key={site.id}
                        className='flex items-center space-x-2 cursor-pointer'
                      >
                        <input
                          type='checkbox'
                          checked={editForm.operateSiteIds?.includes(site.id)}
                          onChange={e => {
                            const currentIds = editForm.operateSiteIds ?? [];
                            if (e.target.checked) {
                              setEditForm({
                                ...editForm,
                                operateSiteIds: [...currentIds, site.id],
                              });
                            } else {
                              setEditForm({
                                ...editForm,
                                operateSiteIds: currentIds.filter(
                                  id => id !== site.id
                                ),
                              });
                            }
                          }}
                          className='rounded border-gray-300'
                        />
                        <span className='text-sm'>
                          {site.name} - {site.address}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setEditForm({
                      firstName: '',
                      lastName: '',
                      phoneNumber: '',
                      jobTitle: '',
                      department: '',
                      location: '',
                      role: '',
                      operateSiteIds: [],
                    });
                  }}
                  className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'
                >
                  Update User
                </button>
              </div>
            </form>
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
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  confirmDialog.onConfirm();
                  hideConfirmation();
                }}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'
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
