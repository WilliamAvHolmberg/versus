import { prisma } from '../../../src/lib/db'
import { AdminLayout } from '../../../src/components/layout/AdminLayout'
import { ToggleAdminButton } from '../../../src/components/admin/ToggleAdminButton'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary-50 dark:bg-primary-800">
              <tr>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Admin</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-primary-50 dark:hover:bg-primary-800/50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.name || '-'}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.email || '-'}</td>
                  <td className="px-6 py-4">
                    {user.superAdmin ? '✅' : '❌'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <ToggleAdminButton 
                      user={user}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
} 