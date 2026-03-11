import { Outlet } from 'react-router-dom'
import FarmerTopBar from './FarmerTopBar'
import FarmerBottomNav from './FarmerBottomNav'

export default function FarmerLayout() {
  return (
    <div className="min-h-screen bg-[#f0f7f0] flex flex-col">
      <FarmerTopBar />
      {/* Main scrollable area, padded for bottom nav */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <FarmerBottomNav />
    </div>
  )
}
