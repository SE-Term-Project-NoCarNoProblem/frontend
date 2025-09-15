'use client'

interface DriverInfoCardProps {
  driver: {
    name: string
    vehicle: string
    plateNumber: string
    rating: number
    avatar: string
    status: string
    estimatedArrival?: string
    phone?: string
  }
  onMessageDriver?: () => void
  onCancel?: () => void
  onBack?: () => void
  showActions?: boolean
  showStatus?: boolean
  showBackButton?: boolean
}

export default function DriverInfoCard({ 
  driver, 
  onMessageDriver, 
  onCancel,
  onBack,
  showActions = true,
  showStatus = true,
  showBackButton = false 
}: DriverInfoCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-t-3xl p-6 space-y-4">
      {/* Back Button Row */}
      {showBackButton && onBack && (
        <div className="flex items-center mb-2">
          <button 
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#0E4663"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* Driver Info Row */}
      <div className="flex items-start space-x-3">
        {/* Avatar & Rating Column */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {driver.avatar}
          </div>
          
          {/* Rating */}
          <div className="ml-0.5">
            <div className="bg-[#0E4663] rounded-lg px-2 py-1 flex items-center space-x-1 shadow-sm">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-white">{driver.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Driver Details */}
        <div className="flex-1">
          <h3 className="font-semibold text-[#0E4663]">{driver.name}</h3>
          <p className="text-sm text-[#0E4663]">{driver.vehicle} • {driver.plateNumber}</p>
        </div>
      </div>

      {/* Status Bar */}
      {showStatus && (
        <div className="flex items-center justify-center py-4 px-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            {/* Accepted */}
            <div className="text-center">
              <div className="mx-auto mb-1 flex items-center justify-center">
                <img src="/complete.svg" alt="accepted" className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-600">accepted</span>
            </div>
            
            {/* Timeline connecting line */}
            <div className="flex items-center">
              <img src="/timeline.svg" alt="timeline" className="w-16 h-1" />
            </div>
            
            {/* On the way */}
            <div className="text-center">
              <div className="mx-auto mb-1 flex items-center justify-center">
                <img 
                  src={driver.status === 'on the way' ? "/complete.svg" : "/notcomplete.svg"} 
                  alt="on the way" 
                  className="w-4 h-4" 
                />
              </div>
              <span className={`text-xs font-medium ${
                driver.status === 'on the way' ? 'text-[#0E4663]' : 'text-gray-600'
              }`}>on the way</span>
            </div>
            
            {/* Timeline connecting line */}
            <div className="flex items-center">
              <img src="/timeline.svg" alt="timeline" className="w-16 h-1" />
            </div>
            
            {/* Pick up */}
            <div className="text-center">
              <div className="mx-auto mb-1 flex items-center justify-center">
                <img 
                  src={driver.status === 'arrived' ? "/complete.svg" : "/notcomplete.svg"} 
                  alt="pick up" 
                  className="w-4 h-4" 
                />
              </div>
              <span className={`text-xs ${driver.status === 'arrived' ? 'text-[#0E4663] font-medium' : 'text-gray-600'}`}>pick up</span>
            </div>
            
            {/* Timeline connecting line */}
            <div className="flex items-center">
              <img src="/timeline.svg" alt="timeline" className="w-16 h-1" />
            </div>
            
            {/* Drop off */}
            <div className="text-center">
              <div className="mx-auto mb-1 flex items-center justify-center">
                <img 
                  src={driver.status === 'completed' ? "/complete.svg" : "/notcomplete.svg"} 
                  alt="drop off" 
                  className="w-4 h-4" 
                />
              </div>
              <span className={`text-xs ${driver.status === 'completed' ? 'text-[#0E4663] font-medium' : 'text-gray-600'}`}>drop off</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex space-x-3">
          <button
            onClick={onMessageDriver}
            className="flex-[2] bg-[#0E4663] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0A3A50] transition-colors flex items-center justify-center"
          >
            Message a driver
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}