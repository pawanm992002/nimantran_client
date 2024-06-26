import './styles/navbar.css';

const Navbar = () => {
  
  return (
    <>
    <nav className='navbar'>
        <div className="logo">
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
        </div>
    <div className="right-section">
        <div className="btn">
          Logout
        </div>
    </div>
    </nav>
    </>
  );
};

export default Navbar;
