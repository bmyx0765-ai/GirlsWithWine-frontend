export default function GirlDetailsSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

          {/* IMAGE */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-3xl bg-gray-200"></div>
          </div>

          {/* CONTENT */}
          <div className="space-y-4">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>

            <div className="flex gap-4 mt-6">
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-20">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-100 rounded-2xl space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 mx-auto bg-gray-200 rounded"></div>
                <div className="h-3 w-16 mx-auto bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-24">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden border bg-white">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}