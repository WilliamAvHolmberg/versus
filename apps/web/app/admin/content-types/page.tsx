import { prisma } from '../../../src/lib/db'
import { AdminLayout } from '../../../src/components/layout/AdminLayout'
import { ContentTypeForm } from '../../../src/components/admin/ContentTypeForm'
import { DeleteButton } from '../../../src/components/admin/DeleteButton'
import { deleteContentType } from '../../../src/actions/admin'

export default async function AdminContentTypesPage() {
  const contentTypes = await prisma.contentType.findMany({
    include: {
      _count: {
        select: {
          bookmarks: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Types</h1>
          <ContentTypeForm />
        </div>

        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary-50 dark:bg-primary-800">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Strategy</th>
                <th className="px-6 py-3 text-left">Logo</th>
                <th className="px-6 py-3 text-left">Bookmarks</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
              {contentTypes.map(type => (
                <tr key={type.id} className="hover:bg-primary-50 dark:hover:bg-primary-800/50">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <img
                      src={type.logo} 
                      alt={type.name}
                      className="w-6 h-6" 
                    />
                    {type.name}
                  </td>
                  <td className="px-6 py-4">{type.strategy}</td>
                  <td className="px-6 py-4">
                    <a 
                      href={type.logo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {type._count?.bookmarks || 0}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <ContentTypeForm 
                      contentType={type}
                      mode="edit"
                    />
                    <DeleteButton 
                      onDelete={async () => {
                        'use server'
                        await deleteContentType(type.id)
                      }}
                      label="Content Type"
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