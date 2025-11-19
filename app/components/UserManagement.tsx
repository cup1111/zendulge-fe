import { ChevronLeft, ChevronRight, Edit2, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '~/hooks/useAuth';

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
  businessId: string;
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
  businessId,
  excludeUserId,
}: Readonly<UserManagementProps>) {
  const { user } = useAuth();
  const [businessUsers, setBusinessUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [operateSites, setOperateSites] = useState<OperateSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    const filtered = businessUsers.filter(businessUser => {
      if (excludeUserId && businessUser.id === excludeUserId) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        businessUser.firstName?.toLowerCase().includes(searchLower) ??
        businessUser.lastName?.toLowerCase().includes(searchLower) ??
        businessUser.email?.toLowerCase().includes(searchLower) ??
        businessUser.jobTitle?.toLowerCase().includes(searchLower) ??
        businessUser.role?.name?.toLowerCase().includes(searchLower)
      );
    });

    return filtered;
  }, [businessUsers, excludeUserId, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination helper functions
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Function to fetch operate sites
  const fetchOperateSites = async (
    businessIdParam: string
  ): Promise<OperateSite[]> => {
    const response = await api.get(
      API_CONFIG.endpoints.business.operateSites(businessIdParam)
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
      if (!businessId || businessId === '') return;
      setLoading(true);
      setError(null);

      // Load users, roles, and operate sites
      const [usersData, rolesData, sitesData] = await Promise.all([
        UserManagementService.getBusinessUsers(businessId),
        UserManagementService.getBusinessRoles(businessId),
        fetchOperateSites(businessId),
      ]);

      setBusinessUsers(usersData);
      setRoles(rolesData);
      setOperateSites(sitesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  // Load users and roles on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await UserManagementService.createBusinessUser(businessId, createForm);
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

  const handleEditUser = (targetUser: User) => {
    setSelectedUser(targetUser);
    // Find all operateSites where this user is a member
    const assignedSiteIds = operateSites
      .filter(
        site =>
          Array.isArray(site.members) &&
          site.members.some(
            (member: { id: string }) => member.id === targetUser.id
          )
      )
      .map(site => site.id);
    setEditForm({
      firstName: targetUser.firstName ?? '',
      lastName: targetUser.lastName ?? '',
      phoneNumber: targetUser.phoneNumber ?? '',
      jobTitle: targetUser.jobTitle ?? '',
      department: targetUser.department ?? '',
      location: targetUser.location ?? '',
      role: targetUser.role?.id ?? '',
      operateSiteIds: assignedSiteIds,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError(null);
      await UserManagementService.updateBusinessUser(
        businessId,
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

  const handleDeleteUser = async (targetUser: User) => {
    showConfirmation(
      'Delete User',
      `Are you sure you want to delete ${targetUser.firstName} ${targetUser.lastName}? This action cannot be undone.`,
      async () => {
        try {
          setError(null);
          await UserManagementService.deleteBusinessUser(
            businessId,
            targetUser.id
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
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h2 className='text-2xl font-bold'>Business Users</h2>

        {/* Search and Add User */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search users...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64'
            />
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            type='button'
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap'
          >
            Add User
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className='text-sm text-gray-600'>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of{' '}
        {filteredUsers.length} users
        {searchTerm && ` matching "${searchTerm}"`}
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
            {paginatedUsers.map(businessUser => (
              <tr key={businessUser.id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {businessUser.firstName} {businessUser.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {businessUser.email}
                    </div>
                    {businessUser.phoneNumber && (
                      <div className='text-xs text-gray-400'>
                        📞 {businessUser.phoneNumber}
                      </div>
                    )}
                    {businessUser.jobTitle && (
                      <div className='text-xs text-gray-400'>
                        {businessUser.jobTitle}
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {businessUser.role?.name
                      ? capitalizeFirstLetter(businessUser.role.name)
                      : 'No role assigned'}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      businessUser.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {businessUser.active ? 'Active' : 'Email Unverified'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                  <button
                    type='button'
                    onClick={() => handleEditUser(businessUser)}
                    className='inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer'
                    title='Edit User'
                  >
                    <Edit2 className='w-4 h-4 mr-1' />
                    Edit User
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeleteUser(businessUser)}
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

        {filteredUsers.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            {searchTerm
              ? `No users found matching "${searchTerm}".`
              : 'No users found.'}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              type='button'
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              Previous
            </button>
            <button
              type='button'
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing page <span className='font-medium'>{currentPage}</span>{' '}
                of <span className='font-medium'>{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
              >
                <button
                  type='button'
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' aria-hidden='true' />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      type='button'
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type='button'
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' aria-hidden='true' />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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
