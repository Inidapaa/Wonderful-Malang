const NotFound = () => {
  return (
    <>
      <div class=" flex flex-col mx-auto size-full h-screen bg-white w-screen pt-[10vw]">
        <main id="content">
          <div class="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 class="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-black">
              404
            </h1>
            <p class="mt-3 text-gray-600 dark:text-neutral-400">
              Oops, something went wrong.
            </p>
            <p class="text-gray-600 dark:text-neutral-400">
              Sorry, we couldn't find your page.
            </p>
          </div>
        </main>
        <footer class="mt-auto text-center py-5">
          <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              © All Rights Reserved. 2023.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NotFound;
