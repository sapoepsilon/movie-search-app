function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Movie Search</h1>
          <span className="text-sm text-muted-foreground">John Doe</span>
        </div>
      </div>
    </header>
  )
}

export default Header