export default function Loader() {
  return (
    <div className="loader-card rounded-[32px] border border-gray-200 bg-white/95 p-10 text-center shadow-lg backdrop-blur-sm">
      <div className="loader-ring mx-auto mb-6">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="text-sm text-gray-700">Fetching the latest forecast...</p>
    </div>
  )
}
