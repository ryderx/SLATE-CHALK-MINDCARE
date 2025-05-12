export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Slate & Chalk MindCare. All rights reserved.</p>
        <p className="mt-1">Designed with care.</p>
      </div>
    </footer>
  );
}
