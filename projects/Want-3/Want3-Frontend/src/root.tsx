import NavBar from 'components/NavBar'
import { Outlet } from 'react-router-dom'

import Ellipse1 from 'assets/Ellipse1.png'
import Ellipse2 from 'assets/Ellipse2.png'
import Ellipse3 from 'assets/Ellipse3.png'

function Layout() {
  return (
    <div className="flex flex-col w-full h-screen bg-MainBodyColor1/5">
      <img src={Ellipse1} className='absolute right-0 bottom-0  z-[-1] w-1/2'></img>
      <img src={Ellipse2} className='absolute left-1/4 -top-10 z-[-1] w-1/2'></img>
      <img src={Ellipse3} className='absolute left-0 top-10 z-[-1] w-1/3'></img>

      <NavBar />
      <Outlet/>
    </div>
  )
}

export default Layout
