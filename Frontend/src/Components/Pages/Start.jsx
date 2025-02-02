import { Link } from 'react-router-dom';


const Start = () => {
    return (
        <div className="h-screen bg-black bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: `url('motion.gif')` }}>
            <Link to="/root/home">
                <button className="btn bg-[#6A1E55] hover:bg-[#a12e81] text-2xl font-medium text-white rounded">
                    আসুন বাংলায় শুরু করি
                </button>
            </Link>
        </div>
    );
};

export default Start;
