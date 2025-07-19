import { NavLink } from 'react-router-dom'
import { Home, Film, Plus, Upload } from 'lucide-react'

function AdminSidebar() {
  const navItems = [
    {
      to: '/admin',
      icon: Home,
      label: 'Dashboard',
      end: true
    },
    {
      to: '/admin/movies',
      icon: Film,
      label: 'Manage Movies'
    },
    {
      to: '/admin/movies/new',
      icon: Plus,
      label: 'Add Movie'
    }
  ]

  return (
    <aside className="w-64 bg-muted/30 border-r border-border min-h-[calc(100vh-73px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar