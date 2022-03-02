export function Footer({ className }: { className: string }) {
  return (
    <footer
      className={`${className} flex justify-center  py-4 bg-white dark:bg-gray-800`}
    >
      <p className="py-2 text-gray-800 dark:text-white sm:py-0">Tweeter 2022</p>
    </footer>
  );
}
