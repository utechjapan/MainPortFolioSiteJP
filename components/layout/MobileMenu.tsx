// components/layout/MobileMenu.tsx
interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      onClick={() => setIsOpen(false)}
      aria-label="Close mobile menu"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      }}
    ></div>
  );
}
