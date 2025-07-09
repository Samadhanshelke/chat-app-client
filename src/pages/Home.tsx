import Sidebar from "../components/sidebar/Sidebar"

const Home = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen bg-neutral-900">
        <div className="flex w-full h-full justify-between max-w-[1400px]">
            <div className="w-4/12  h-full ">
                <Sidebar/>
            </div>
            <div className="flex  h-full ">
                    content
            </div>

        </div>
    </div>
  )
}

export default Home